import Layout from "@/components/Layout";
import Link from "next/link";

const TermsPageContainer = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: (
        <p>
          By accessing or using NewScout ("the Service"), you agree to be bound
          by these Terms of Service. If you do not agree, you may not use the
          Service. We may update these terms at any time; continued use after
          changes constitutes acceptance.
        </p>
      ),
    },
    {
      title: "Description of Service",
      content: (
        <p>
          NewScout is a news aggregation platform that curates and organizes
          articles from 50+ verified third-party publishers. We do not create or
          edit original content. All articles link back to their original
          source. The Service is provided "as is" and may be modified,
          suspended, or discontinued at any time.
        </p>
      ),
    },
    {
      title: "User Accounts",
      content: (
        <p>
          Some features require creating an account. You are responsible for
          maintaining the confidentiality of your credentials and for all
          activity under your account. You must provide accurate information and
          be at least 16 years old. We reserve the right to suspend or terminate
          accounts that violate these terms.
        </p>
      ),
    },
    {
      title: "Acceptable Use",
      content: (
        <p>
          You agree not to: (a) use the Service for any unlawful purpose; (b)
          scrape, crawl, or harvest data without written permission; (c) attempt
          to gain unauthorized access to any part of the Service; (d) interfere
          with or disrupt the Service's infrastructure; (e) impersonate another
          person or entity; or (f) use automated tools to access the Service
          beyond our published API.
        </p>
      ),
    },
    {
      title: "API Usage",
      content: (
        <p>
          Access to the NewScout API is subject to rate limits and usage quotas
          based on your plan tier. API keys are personal and non-transferable.
          We reserve the right to revoke API access for abuse, excessive usage,
          or violation of these terms. Commercial use of API data requires a
          Team plan or higher.
        </p>
      ),
    },
    {
      title: "Intellectual Property",
      content: (
        <p>
          The NewScout platform, including its design, branding, and code, is
          owned by NewScout and protected by intellectual property laws. Article
          content belongs to respective publishers and is displayed under
          aggregation fair-use principles. You may not reproduce, distribute, or
          create derivative works from our platform without permission.
        </p>
      ),
    },
    {
      title: "Third-Party Content",
      content: (
        <p>
          NewScout aggregates content from third-party publishers. We do not
          guarantee the accuracy, completeness, or reliability of any
          third-party content. Views expressed in articles do not represent
          NewScout's position. We are not responsible for the content, privacy
          practices, or terms of any linked third-party sites.
        </p>
      ),
    },
    {
      title: "Subscriptions & Billing",
      content: (
        <p>
          Paid plans are billed monthly or annually as selected. You may cancel
          at any time; access continues through the end of your billing period.
          Refunds are not provided for partial billing periods. We reserve the
          right to change pricing with 30 days' notice to existing subscribers.
        </p>
      ),
    },
    {
      title: "Limitation of Liability",
      content: (
        <p>
          To the maximum extent permitted by law, NewScout shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the Service. Our total liability
          shall not exceed the amount paid by you in the 12 months preceding the
          claim.
        </p>
      ),
    },

    {
      title: "Termination",
      content: (
        <p>
          We may terminate or suspend your access immediately, without prior
          notice, for conduct that we believe violates these terms or is harmful
          to other users, publishers, or NewScout. Upon termination, your right
          to use the Service ceases immediately, though provisions that by
          nature should survive will remain in effect.
        </p>
      ),
    },

    {
      title: "Governing Law",
      content: (
        <p>
          These terms are governed by the laws of the State of California,
          without regard to conflict of law provisions. Any disputes shall be
          resolved in the courts located in San Francisco County, California.
        </p>
      ),
    },
    {
      title: "Contact",
      content: (
        <p>
          Questions about these terms? Reach us at&nbsp;
          <Link
            href="mailto:legal@newscout.app"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            legal@newscout.app
          </Link> &nbsp;
          or through our&nbsp;
          <Link
            href="/contact"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Contact page
          </Link>
          .
        </p>
      ),
    },
  ];
  return (
    <Layout>
      <section className="border-b border-border bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Terms of Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Effective: March 1, 2026
          </p>
        </div>
      </section>
      <div className="max-w-[90%] md:max-w-6xl mx-auto my-12 md:px-8">
        <p className="mt-8 text-muted-foreground text-base mg:text-lg font-medium leading-8">
          At NewScout.com, accessible from&nbsp;
          <Link
            href="https://newscout.com"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            newscout.com
          </Link>
          , one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by NewScout.com and how we use it.
        </p>
        <p className="mt-8 text-muted-foreground text-base md:text-lg font-medium leading-8">
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us through email at&nbsp;
          <Link
            href="mailto:customercare@NewScout.com"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            customercare@NewScout.com
          </Link>
          .
        </p>
        {sections.map((section, index) => (
          <div
            className="mt-8 bg-card shadow-[3px_5px_20px_3px_rgba(0,0,0,0.08)] rounded-[10px] p-5 leading-8"
            key={index}
          >
            <h2 className="text-primary text-2xl md:text-4xl lg:text-4xl font-bold py-2">
              {section.title}
            </h2>
            <div className="mt-2 h-1 w-20 bg-accent"></div>
            {section.content}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default TermsPageContainer;
