import Link from "next/link";

const Footer = () => {
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
              <li>
                <Link
                  href="/feed"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Browse Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/feed?category=technology"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/feed?category=business"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  About
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  Pricing
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  Contact
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  API Docs
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-primary-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="/terms">
                  <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-primary-foreground">
                  Cookie Policy
                </span>
              </li>
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
