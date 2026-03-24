import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For casual readers who want a better news experience.",
    features: [
      "Browse all aggregated articles",
      "Basic search & filters",
      "5 bookmarks",
      "Reading history (7 days)",
      "Ad-supported",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power readers and professionals who need more.",
    features: [
      "Everything in Free",
      "Unlimited bookmarks & collections",
      "Advanced filters & saved searches",
      "Full reading history",
      "Priority source access",
      "Ad-free experience",
      "Custom RSS feeds",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and organizations tracking news at scale.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared collections & dashboards",
      "API access (10k requests/mo)",
      "Email digests & alerts",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const PricingContainer = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="border-b border-border bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
            Start free. Upgrade when you need more power.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="container py-10">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.highlighted
                  ? "border-accent bg-card shadow-lg shadow-accent/10"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-serif text-xl font-bold text-foreground">
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default PricingContainer;
