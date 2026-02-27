import { li } from "framer-motion/client";
import Link from "next/link";

const Footer = () => {
const discoverItems = [
  { label: "Browse Feed", href: "/feed" },
  { label: "Trending", href: "/trending" },
  { label: "Technology", href: "/feed?category=technology" },
  { label: "Business", href: "/feed?category=business" },
];
 const companyItems = [
   { label: "About", href: "/about" },
   { label: "Pricing", href: "/pricing" },
   { label: "Contact", href: "/contact" },
   { label: "API Docs", href: "/api-docs" },
 ];
const legalItems = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground">
                <span className="font-serif text-base font-bold text-primary">
                  N
                </span>
              </div>
              <span className="font-serif text-xl font-bold">
                New<span className="text-accent">Scout</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-primary-foreground/70">
              Your centralized, searchable, and customizable news experience.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary-foreground">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {discoverItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {companyItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {legalItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} NewScout. All rights reserved.
          Aggregating 50+ verified publishers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
