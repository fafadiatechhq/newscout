import ContactContainer from "@/components/contact/ContactContainer";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Contact");

const ContactPage = () => {
  return (
    <React.Fragment>
      <ContactContainer />
    </React.Fragment>
  );
};

export default ContactPage;
