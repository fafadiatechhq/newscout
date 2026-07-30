from urllib.parse import urlencode

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from opensearchpy import Q
from opensearchpy.exceptions import ConnectionError as OSConnectionError
from opensearchpy.exceptions import ConnectionTimeout
from opensearchpy.exceptions import NotFoundError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.documents import ArticleDocument


def _parse_bool(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    return str(value).lower() in ("1", "true", "yes", "on")


def _parse_int(value):
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _hit_to_article(hit):
    """Map an OpenSearch hit `_source` to an ArticleSerializer-compatible dict."""
    source = hit.to_dict()
    category = source.get("category") or {}
    sources = source.get("source") or []
    tags = source.get("tags") or []

    return {
        "id": int(hit.meta.id),
        "title": source.get("title"),
        "author": source.get("author"),
        "summary": source.get("summary"),
        "content_url": source.get("content_url"),
        "source": sources,
        "category": category,
        "tags": tags,
        "published_at": source.get("published_at"),
        "image_url": source.get("image_url"),
        "trending": bool(source.get("trending", False)),
        "featured": bool(source.get("featured", False)),
        "editors_pick": bool(source.get("editors_pick", False)),
        "is_breaking": bool(source.get("is_breaking", False)),
    }


def _terms_buckets_with_names(agg):
    """Convert category terms buckets (with top_hits name) into {id,name,count}."""
    results = []
    for bucket in agg.buckets:
        name = None
        name_agg = bucket.name
        if name_agg.hits.hits:
            src = name_agg.hits.hits[0].to_dict().get("_source") or {}
            category = src.get("category") or {}
            name = category.get("name")
        results.append(
            {
                "id": bucket.key,
                "name": name,
                "count": bucket.doc_count,
            }
        )
    return results


class ArticleSearchAPI(APIView):
    """
    OpenSearch-backed article discovery.

    Supports full-text query (`q`), facet filters, and returns aggregation
    buckets for categories, sources, tags, and boolean flags.
    """

    @extend_schema(
        summary="Search articles",
        description=(
            "Full-text search over articles indexed in OpenSearch. "
            "Supports facet filters and returns aggregation buckets."
        ),
        tags=["Search"],
        parameters=[
            OpenApiParameter("q", OpenApiTypes.STR, OpenApiParameter.QUERY),
            OpenApiParameter("category_id", OpenApiTypes.INT, OpenApiParameter.QUERY),
            OpenApiParameter("source_id", OpenApiTypes.INT, OpenApiParameter.QUERY),
            OpenApiParameter("tag_id", OpenApiTypes.INT, OpenApiParameter.QUERY),
            OpenApiParameter("is_breaking", OpenApiTypes.BOOL, OpenApiParameter.QUERY),
            OpenApiParameter("trending", OpenApiTypes.BOOL, OpenApiParameter.QUERY),
            OpenApiParameter("featured", OpenApiTypes.BOOL, OpenApiParameter.QUERY),
            OpenApiParameter("editors_pick", OpenApiTypes.BOOL, OpenApiParameter.QUERY),
            OpenApiParameter("published_after", OpenApiTypes.DATETIME, OpenApiParameter.QUERY),
            OpenApiParameter("published_before", OpenApiTypes.DATETIME, OpenApiParameter.QUERY),
            OpenApiParameter("limit", OpenApiTypes.INT, OpenApiParameter.QUERY),
            OpenApiParameter("offset", OpenApiTypes.INT, OpenApiParameter.QUERY),
        ],
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        params = request.query_params
        q = (params.get("q") or "").strip()
        category_id = _parse_int(params.get("category_id"))
        source_id = _parse_int(params.get("source_id"))
        tag_id = _parse_int(params.get("tag_id"))
        is_breaking = _parse_bool(params.get("is_breaking"))
        trending = _parse_bool(params.get("trending"))
        featured = _parse_bool(params.get("featured"))
        editors_pick = _parse_bool(params.get("editors_pick"))
        published_after = params.get("published_after")
        published_before = params.get("published_before")

        try:
            limit = min(max(int(params.get("limit", 20)), 1), 100)
        except (TypeError, ValueError):
            limit = 20
        try:
            offset = max(int(params.get("offset", 0)), 0)
        except (TypeError, ValueError):
            offset = 0

        filters = []
        if category_id is not None:
            filters.append(Q("term", category_id=category_id))
        if source_id is not None:
            filters.append(Q("term", source_ids=source_id))
        if tag_id is not None:
            filters.append(Q("term", tag_ids=tag_id))
        if is_breaking is not None:
            filters.append(Q("term", is_breaking=is_breaking))
        if trending is not None:
            filters.append(Q("term", trending=trending))
        if featured is not None:
            filters.append(Q("term", featured=featured))
        if editors_pick is not None:
            filters.append(Q("term", editors_pick=editors_pick))

        if published_after or published_before:
            range_kwargs = {}
            if published_after:
                range_kwargs["gte"] = published_after
            if published_before:
                range_kwargs["lte"] = published_before
            filters.append(Q("range", published_at=range_kwargs))

        must = []
        if q:
            must.append(
                Q(
                    "multi_match",
                    query=q,
                    fields=["title^3", "summary^2", "author"],
                    type="best_fields",
                    fuzziness="AUTO",
                )
            )

        search = ArticleDocument.search()
        bool_kwargs = {}
        if must:
            bool_kwargs["must"] = must
        if filters:
            bool_kwargs["filter"] = filters
        if bool_kwargs:
            search = search.query(Q("bool", **bool_kwargs))
        else:
            search = search.query(Q("match_all"))

        # Facet aggregations (apply same filters so counts match the result set)
        search.aggs.bucket(
            "categories",
            "terms",
            field="category_id",
            size=50,
        ).metric(
            "name",
            "top_hits",
            size=1,
            _source=["category.name"],
        )
        search.aggs.bucket(
            "sources",
            "terms",
            field="source_ids",
            size=50,
        ).metric(
            "name",
            "top_hits",
            size=1,
            _source=["source"],
        )
        search.aggs.bucket(
            "tags",
            "terms",
            field="tag_ids",
            size=50,
        ).metric(
            "name",
            "top_hits",
            size=1,
            _source=["tags"],
        )
        search.aggs.bucket(
            "flags",
            "filters",
            filters={
                "trending": Q("term", trending=True),
                "featured": Q("term", featured=True),
                "editors_pick": Q("term", editors_pick=True),
                "is_breaking": Q("term", is_breaking=True),
            },
        )

        search = search.sort("-published_at", "-_id")[offset : offset + limit]

        try:
            response = search.execute()
        except NotFoundError:
            return Response(
                {
                    "count": 0,
                    "next": None,
                    "previous": None,
                    "results": [],
                    "aggregations": {
                        "categories": [],
                        "sources": [],
                        "tags": [],
                        "flags": {
                            "trending": 0,
                            "featured": 0,
                            "editors_pick": 0,
                            "is_breaking": 0,
                        },
                    },
                }
            )
        except (OSConnectionError, ConnectionTimeout, ConnectionError) as exc:
            return Response(
                {
                    "detail": "OpenSearch is unavailable.",
                    "error": str(exc),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        results = [_hit_to_article(hit) for hit in response]
        total = response.hits.total.value if hasattr(response.hits.total, "value") else response.hits.total

        aggs = response.aggregations
        categories = _terms_buckets_with_names(aggs.categories)
        # Resolve source/tag names by matching bucket key against nested lists in top_hits
        sources = []
        for bucket in aggs.sources.buckets:
            name = None
            name_agg = bucket.name
            if name_agg.hits.hits:
                src = name_agg.hits.hits[0].to_dict().get("_source", {})
                for item in src.get("source") or []:
                    if item.get("id") == bucket.key:
                        name = item.get("name")
                        break
            sources.append({"id": bucket.key, "name": name, "count": bucket.doc_count})

        tags = []
        for bucket in aggs.tags.buckets:
            name = None
            name_agg = bucket.name
            if name_agg.hits.hits:
                src = name_agg.hits.hits[0].to_dict().get("_source", {})
                for item in src.get("tags") or []:
                    if item.get("id") == bucket.key:
                        name = item.get("name")
                        break
            tags.append({"id": bucket.key, "name": name, "count": bucket.doc_count})

        flag_buckets = aggs.flags.buckets
        flags = {
            "trending": flag_buckets.trending.doc_count,
            "featured": flag_buckets.featured.doc_count,
            "editors_pick": flag_buckets.editors_pick.doc_count,
            "is_breaking": flag_buckets.is_breaking.doc_count,
        }

        base = request.build_absolute_uri(request.path)
        query = {k: v for k, v in params.items() if k not in ("limit", "offset")}

        def page_url(new_offset):
            qdict = {**query, "limit": limit, "offset": new_offset}
            return f"{base}?{urlencode(qdict)}"

        next_url = page_url(offset + limit) if offset + limit < total else None
        previous_url = page_url(max(offset - limit, 0)) if offset > 0 else None

        return Response(
            {
                "count": total,
                "next": next_url,
                "previous": previous_url,
                "results": results,
                "aggregations": {
                    "categories": categories,
                    "sources": sources,
                    "tags": tags,
                    "flags": flags,
                },
            }
        )


def opensearch_is_available():
    """Return True if the configured OpenSearch cluster responds."""
    try:
        return bool(ArticleDocument._index.connection.ping())
    except Exception:
        try:
            ArticleDocument.search()[:0].execute()
            return True
        except Exception:
            return False
