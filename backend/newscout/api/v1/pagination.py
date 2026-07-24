from rest_framework.pagination import LimitOffsetPagination


class StandardResultsSetPagination(LimitOffsetPagination):
    """Limit/offset pagination matching the mobile client's contract."""

    default_limit = 20
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 100
