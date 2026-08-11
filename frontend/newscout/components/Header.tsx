"use client";
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
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useCategories } from "@/hooks/use-categories";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { topLevelCategories, isLoading: categoriesLoading } = useCategories();
  const navCategories = topLevelCategories.slice(0, 6);

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 p-0 m-0 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 w-full">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="container flex h-10 justify-center md:items-center md:justify-end">
          <div className="flex items-center text-xs gap-2 md:gap-4">
            <Link
              href="/trending"
              className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <TrendingUp className="h-3 w-3" />
              Trending
            </Link>
            <span className="text-primary-foreground/30">|</span>
            <Link
              href="/bookmarks"
              className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              Bookmarks
            </Link>
            <span className="text-primary-foreground/30">|</span>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex h-18 items-center justify-between gap-2 mb-1">
        <div
          className={`items-center gap-8 ${
            searchOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="NewScout"
              className="h-13 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/feed"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              All
            </Link>
            {!categoriesLoading &&
              navCategories.map((cat) => (
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

        <div
          className={`flex items-center gap-2 min-w-0 ${
            searchOpen ? "flex-1 md:flex-none" : ""
          }`}
        >
          {searchOpen ? (
            <form
              onSubmit={handleSearch}
              className="flex flex-1 md:flex-none items-center gap-2 min-w-0"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="h-9 w-full min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:flex-none md:w-64"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
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
            className="h-9 w-9 shrink-0 lg:hidden"
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
            <Link
              href="/feed"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              All
            </Link>
            {!categoriesLoading &&
              topLevelCategories.map((cat) => (
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
