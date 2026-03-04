import SearchResults from "@/components/SearchResults";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `NewScout — ${q}` : "NewScout — Search",
  };
}

const SearchPage = () => {
  return (
    <div>
      <SearchResults />
    </div>
  );
};

export default SearchPage;
