import TermsPageContainer from "@/components/TermsPageContainer/TermsPageContainer";
import { generateMetadata } from "@/utils/title";

export const metadata = generateMetadata("NewScout — Terms of Service");

const termsPage = () => {
  return (
    <>
      <TermsPageContainer/>
    </>
  );
};

export default termsPage;
