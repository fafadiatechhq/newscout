import ArticleDetail from "@/components/articles/ArticleDetail";

import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata(
  "NewScout — article",
);

const ArticleDetailPage = () => {
  return (
    <>
      <ArticleDetail />
    </>
  );
};

export default ArticleDetailPage;