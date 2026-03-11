import Layout from "../Layout";

const sections = [
  {
    title: "What Are Cookies?",
    content:
      "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.",
  },
  {
    title: "How We Use Cookies",
    content:
      "NewScout uses cookies for essential site functionality (authentication, preferences), analytics (understanding how readers use the platform), and personalization (remembering your preferred categories and reading history).",
  },
  {
    title: "Essential Cookies",
    content:
      "These are required for core functionality such as keeping you signed in, remembering your theme preference, and maintaining your session. They cannot be disabled.",
  },
  {
    title: "Analytics Cookies",
    content:
      "We use analytics cookies to understand aggregated usage patterns — which articles are most read, how users navigate the platform, and where we can improve. No personally identifiable information is collected.",
  },
  {
    title: "Personalization Cookies",
    content:
      "These cookies enable features like your reading history, bookmarked articles, and customized feed preferences. Disabling them will limit personalized features.",
  },
  {
    title: "Third-Party Cookies",
    content:
      "Some of our verified publisher partners may set cookies when you click through to their original articles. We do not control these cookies and recommend reviewing each publisher's cookie policy.",
  },
  {
    title: "Managing Your Cookies",
    content:
      "You can manage or delete cookies through your browser settings at any time. Note that disabling certain cookies may affect site functionality. Most browsers allow you to block or delete cookies under Privacy or Security settings.",
  },
  {
    title: "Updates to This Policy",
    content:
      "We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated effective date.",
  },
];

const CookiesPolicyContainer = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Cookie Policy
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 font-serif text-xl font-bold text-foreground">
                {s.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default CookiesPolicyContainer;
