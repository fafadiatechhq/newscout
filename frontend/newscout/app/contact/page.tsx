import Contact from "@/components/contact/Contact";
import { generateMetadata } from "@/utils/title";
import React from "react";

export const metadata = generateMetadata("NewScout — Contact");

const ContactPage = () => {
  return (
    <React.Fragment>
      <Contact />
    </React.Fragment>
  );
};

export default ContactPage;
