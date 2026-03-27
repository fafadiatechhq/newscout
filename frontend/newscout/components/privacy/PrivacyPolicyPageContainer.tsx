import Layout from "../Layout";
import Link from "next/link";

const PrivacyPolicyPageContainer = () => {
  const sections = [
    {
      title: "Introduction",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
          NewScout (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects
          your privacy and is committed to protecting your personal data. This
          Privacy Policy explains how we collect, use, store, and share
          information when you use our news aggregation platform and related
          services.
        </p>
      ),
    },
    {
      title: "Information We Collect",
      content: (
        <>
          <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
            <strong className="text-foreground">Account Information:</strong>{" "}
            When you create an account, we collect your name, email address, and
            password. Social sign-in may provide your name and profile picture.
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
            <strong className="text-foreground">Usage Data:</strong> We
            automatically collect information about how you interact with the
            Service, including articles viewed, search queries, bookmarks,
            categories browsed, time spent, and device information (browser
            type, operating system, screen resolution).
          </p>
          <p className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
            <strong className="mt-2 text-neutral-500 md:text-lg  md:font-medium  md:leading-8 leading-7">
              Cookies & Local Storage:
            </strong>{" "}
            We use cookies and browser local storage for authentication, theme
            preferences, reading history, and analytics. See our{" "}
            <Link
              href="/cookies"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
        </>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          We use collected information to: (a) provide and maintain the Service;
          (b) personalize your news feed and recommendations; (c) remember your
          preferences and reading history; (d) send transactional emails
          (account verification, password resets); (e) analyze usage patterns to
          improve the platform; and (f) detect and prevent fraud or abuse.
        </p>
      ),
    },
    {
      title: "Information Sharing",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          We do not sell your personal data. We may share information with: (a)
          service providers who assist in operating the platform (hosting,
          analytics, email delivery) under strict data processing agreements;
          (b) law enforcement when required by law or to protect our rights; and
          (c) in connection with a merger, acquisition, or sale of assets, with
          notice to users.
        </p>
      ),
    },
    {
      title: "Data Retention",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          We retain account data for as long as your account is active. Reading
          history and usage data are retained for up to 24 months. You can
          delete your reading history at any time from your account settings.
          Upon account deletion, we remove your personal data within 30 days,
          except where retention is required by law.
        </p>
      ),
    },
    {
      title: " Data Security",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          We implement industry-standard security measures including encryption
          in transit (TLS), secure password hashing, and regular security
          audits. However, no method of transmission or storage is 100% secure.
          We cannot guarantee absolute security but are committed to protecting
          your data using commercially reasonable measures.
        </p>
      ),
    },
    {
      title: "Your Rights",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          Depending on your jurisdiction, you may have the right to: (a) access
          your personal data; (b) correct inaccurate data; (c) request deletion
          of your data; (d) object to or restrict processing; (e) data
          portability; and (f) withdraw consent. To exercise these rights,
          contact us at{" "}
          <span className="text-primary font-medium">privacy@newscout.app</span>
          .
        </p>
      ),
    },
    {
      title: "Children's Privacy",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          NewScout is not directed at children under 16. We do not knowingly
          collect personal data from children under 16. If we learn that we have
          collected data from a child under 16, we will take steps to delete it
          promptly.
        </p>
      ),
    },

    {
      title: "International Transfers",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          Your data may be processed in the United States or other countries
          where our service providers operate. We ensure appropriate safeguards
          are in place, including standard contractual clauses, to protect your
          data in accordance with this policy.
        </p>
      ),
    },

    {
      title: "Changes to This Policy",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          We may update this Privacy Policy periodically. Material changes will
          be communicated via email or a prominent notice on the platform at
          least 14 days before taking effect. Your continued use after changes
          constitutes acceptance of the updated policy.
        </p>
      ),
    },

    {
      title: "Contact Us",
      content: (
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          For privacy-related questions or requests, contact us at{" "}
          <span className="text-primary font-medium">privacy@newscout.app</span>{" "}
          or visit our{" "}
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
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Effective: March 1, 2026
          </p>
        </div>
      </section>
      <div className=" max-w-[90%] md:px-8 md:max-w-7xl mx-auto my-12 box-border">
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium md:leading-8 leading-7">
          At NewScout.in, accessible from{" "}
          <Link href="http://newscout.in">http://newscout.in</Link>, one of our main
          priorities is the privacy of our visitors. This Privacy Policy
          document contains types of information that is collected and recorded
          by NewScout.com and how we use it.
        </p>
        <p className="mt-2 text-neutral-500 md:text-lg md:font-medium leading-7">
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us through email at{" "}
          <Link href="mailto:customercare@newscout.com">
            customercare@newscout.com
          </Link>
        </p>
        {sections.map((section, index) => (
          <div
            className="mt-8 bg-card rounded-xl shadow shadow-gray md:text-3xl font-semibold  p-5"
            key={index}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-primary">
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

export default PrivacyPolicyPageContainer;
