import ArticleDetail from "@/components/articles/ArticleDetail";
import { getArticleById } from "@/utils/mock-data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const article = getArticleById(id);

  return {
    title: article
      ? `${article.title} | NewScout`
      : "Article Not Found | NewScout",
  };
}

const ArticleDetailPage = () => {
  return (
    <>
      <ArticleDetail />
    </>
  );
};

export default ArticleDetailPage;
