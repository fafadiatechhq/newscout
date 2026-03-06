import SearchResultsContainer from "@/components/SearchResultsContainer";
import type { Metadata } from "next";
import React from "react";

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

const SearchResultsPage = () => {
  return (
    <React.Fragment>
      <SearchResultsContainer />
    </React.Fragment>
  );
};

export default SearchResultsPage;
