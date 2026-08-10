import ArticleDetailContainer from "@/components/articles/ArticleDetailContainer";
import { fetchArticle } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/types";
import { getArticleById } from "@/utils/mock-data";
import type { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

async function resolveArticle(id: string) {
  try {
    return await fetchArticle(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return getArticleById(id) ?? null;
    }
    return getArticleById(id) ?? null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const article = await resolveArticle(id);

  return {
    title: article
      ? `${article.title} | NewScout`
      : "Article Not Found | NewScout",
  };
}

const ArticleDetailPage = () => {
  return (
    <React.Fragment>
      <ArticleDetailContainer />
    </React.Fragment>
  );
};

export default ArticleDetailPage;
