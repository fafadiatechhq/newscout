import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  TrendingUp,
  Bookmark,
  User,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { categories } from "@/utils/mock-data";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="container flex h-10 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-primary-foreground/70">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/trending"
              className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <TrendingUp className="h-3 w-3" />
              Trending
            </Link>
            <span className="text-primary-foreground/30">|</span>
            <button className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground">
              <Bookmark className="h-3 w-3" />
              Bookmarks
            </button>
            <span className="text-primary-foreground/30">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <Shield className="h-3 w-3" />
              Admin
            </Link>
            <span className="text-primary-foreground/30">|</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-3 w-3" />
              ) : (
                <Sun className="h-3 w-3" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <span className="text-primary-foreground/30">|</span>
            <button className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground">
              <User className="h-3 w-3" />
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-serif text-lg font-bold text-primary-foreground">
                N
              </span>
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              New<span className="text-accent">Scout</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/feed"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              All
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/feed?category=${cat.slug}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:w-64"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/feed?category=${cat.slug}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
