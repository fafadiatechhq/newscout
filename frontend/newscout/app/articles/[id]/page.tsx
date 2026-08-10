import ArticleDetailContainer from "@/components/articles/ArticleDetailContainer";
import { resolveArticleById } from "@/lib/api/articles";
import type { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const article = await resolveArticleById(id);

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
