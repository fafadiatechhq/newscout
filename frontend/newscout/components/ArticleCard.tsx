"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Clock, Eye, BadgeCheck, Share2, Link2 } from "lucide-react";
import { type Article, formatTimeAgo } from "@/utils/mock-data";

// Article Card Component Interface.
interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured";
}

const ShareButton = ({ article }: { article: Article }) => {
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const articlePath = `/articles/${article.id}`;
  const url = `${origin}${articlePath}`;
  const text = article.title;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Article link copied to clipboard.",
    });
  };

  const openShare = (e: React.MouseEvent, shareUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
        <button
          className="rounded-full bg-background/80 p-2 text-muted-foreground opacity-0 backdrop-blur-sm transition-all hover:bg-background hover:text-foreground group-hover:opacity-100"
          aria-label="Share article"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      {/* Share Dropdown Option */}
      <DropdownMenuContent align="end" className="w-48 bg-card">
        <DropdownMenuItem onClick={handleCopy}>
          <Link2 className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            openShare(
              e,
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url,
              )}&text=${encodeURIComponent(text)}`,
            )
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M1 2H3.5L18.5 22H16L1 2ZM5.5 2H8L23 22H20.5L5.5 2Z"
              fill="currentColor"
            />
            <path d="M3 2H8V4H3V2ZM16 22H21V20H16V22Z" fill="currentColor" />
            <path d="M18.5 2H22L5 22H1.5L18.5 2Z" fill="currentColor" />
          </svg>
          X / Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            openShare(
              e,
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url,
              )}`,
            )
          }
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            openShare(
              e,
              `https://api.whatsapp.com/send?text=${encodeURIComponent(
                text + " " + url,
              )}`,
            )
          }
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            openShare(
              e,
              `https://t.me/share/url?url=${encodeURIComponent(
                url,
              )}&text=${encodeURIComponent(text)}`,
            )
          }
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Telegram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  if (variant === "featured") {
    return (
      <Link
        href={`/articles/${article.id}`}
        className="group relative block overflow-hidden rounded-xl"
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/30 to-transparent" />
        <div className="absolute right-4 top-4">
          <ShareButton article={article} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
          <Badge className="mb-3 text-[8px] md:text-sm bg-accent text-accent-foreground hover:bg-accent/90">
            {article.category.name}
          </Badge>
          <h2 className="mb-2 font-serif text-sm md:text-2xl font-bold leading-tight text-background lg:text-4xl">
            {article.title}
          </h2>
          <p className="mb-4 hidden text-sm text-background/80 md:block md:text-base">
            {article.summary}
          </p>
          <div className="flex items-center gap-4 text-xs text-background/60">
            <span className="flex items-center gap-1">
              {article.source.is_verified && (
                <BadgeCheck className="h-3 w-3 text-accent" />
              )}
              {article.source.name}
            </span>
            <span>{article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time} min
            </span>
            <span>{formatTimeAgo(article.published_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.id}`}
        className="group flex gap-4 rounded-lg p-3 transition-colors hover:bg-secondary"
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {article.source.is_verified && (
              <BadgeCheck className="h-3 w-3 text-primary" />
            )}
            <span>{article.source.name}</span>
            <span>·</span>
            <span>{formatTimeAgo(article.published_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-3 top-3">
          <ShareButton article={article} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {article.category.name}
          </Badge>
          {article.views > 10000 && (
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 text-xs">
              <TrendingIcon className="mr-1 h-3 w-3" />
              Trending
            </Badge>
          )}
        </div>
        <h3 className="mb-2 font-serif text-lg font-bold leading-tight text-card-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {article.source.is_verified && (
              <BadgeCheck className="h-3 w-3 text-primary" />
            )}
            <span className="font-medium">{article.source.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {(article.views / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const TrendingIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export default ArticleCard;
