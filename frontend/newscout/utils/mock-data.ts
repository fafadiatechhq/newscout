export interface Article {
  id: string;
  title: string;
  summary: string;
  content_url: string;
  source: Source;
  category: Category;
  author: string;
  published_at: string;
  image_url: string;
  tags: string[];
  reading_time: number;
  views: number;
}

export interface Source {
  id: string;
  name: string;
  logo_url: string;
  is_verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  article_count: number;
  parentId?: string | null;
}

export const categories: Category[] = [
  { id: "1", name: "Technology", slug: "technology", description: "Latest in tech", article_count: 1243 },
  { id: "2", name: "Business", slug: "business", description: "Markets & finance", article_count: 892 },
  { id: "3", name: "Politics", slug: "politics", description: "Government & policy", article_count: 756 },
  { id: "4", name: "Science", slug: "science", description: "Research & discoveries", article_count: 534 },
  { id: "5", name: "Health", slug: "health", description: "Wellness & medicine", article_count: 678 },
  { id: "6", name: "Sports", slug: "sports", description: "Games & athletics", article_count: 445 },
  { id: "7", name: "Entertainment", slug: "entertainment", description: "Culture & media", article_count: 389 },
  { id: "8", name: "World", slug: "world", description: "International news", article_count: 921 },
];

export const sources: Source[] = [
  { id: "s1", name: "Reuters", logo_url: "", is_verified: true },
  { id: "s2", name: "The Guardian", logo_url: "", is_verified: true },
  { id: "s3", name: "Bloomberg", logo_url: "", is_verified: true },
  { id: "s4", name: "TechCrunch", logo_url: "", is_verified: true },
  { id: "s5", name: "The Verge", logo_url: "", is_verified: true },
  { id: "s6", name: "BBC News", logo_url: "", is_verified: true },
  { id: "s7", name: "Al Jazeera", logo_url: "", is_verified: true },
  { id: "s8", name: "Wired", logo_url: "", is_verified: true },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const articles: Article[] = [
  {
    id: "a1",
    title: "AI Revolution Reshapes Global Markets as Tech Giants Compete for Dominance",
    summary: "Major technology companies are investing billions in artificial intelligence infrastructure, creating a new competitive landscape that is transforming industries from healthcare to finance. Analysts predict this shift will define the next decade of innovation.",
    content_url: "#",
    source: sources[2],
    category: categories[0],
    author: "Sarah Chen",
    published_at: hoursAgo(1),
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["AI", "Markets", "Tech"],
    reading_time: 8,
    views: 15420,
  },
  {
    id: "a2",
    title: "Central Banks Signal New Era of Monetary Policy Amid Global Economic Shifts",
    summary: "Federal Reserve and European Central Bank officials indicate a coordinated approach to interest rates as inflation patterns diverge across major economies.",
    content_url: "#",
    source: sources[0],
    category: categories[1],
    author: "Michael Torres",
    published_at: hoursAgo(2),
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    tags: ["Economy", "Federal Reserve", "Inflation"],
    reading_time: 6,
    views: 12300,
  },
  {
    id: "a3",
    title: "Breakthrough in Quantum Computing Promises to Accelerate Drug Discovery",
    summary: "Researchers demonstrate a quantum algorithm that could reduce drug development timelines from years to months, potentially saving millions of lives.",
    content_url: "#",
    source: sources[7],
    category: categories[3],
    author: "Dr. Emily Park",
    published_at: hoursAgo(3),
    image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    tags: ["Quantum", "Healthcare", "Research"],
    reading_time: 10,
    views: 9870,
  },
  {
    id: "a4",
    title: "Climate Summit 2026: Nations Agree on Historic Carbon Reduction Framework",
    summary: "In a landmark agreement, over 190 countries commit to binding carbon emission targets with measurable milestones and accountability mechanisms.",
    content_url: "#",
    source: sources[1],
    category: categories[7],
    author: "James Wright",
    published_at: hoursAgo(4),
    image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f7b6351?w=800&q=80",
    tags: ["Climate", "Policy", "Environment"],
    reading_time: 7,
    views: 8540,
  },
  {
    id: "a5",
    title: "Startup Ecosystem Sees Record Funding Despite Economic Headwinds",
    summary: "Venture capital investment rebounds with a focus on AI, clean energy, and biotech sectors as investors shift toward sustainable growth opportunities.",
    content_url: "#",
    source: sources[3],
    category: categories[1],
    author: "Lisa Wang",
    published_at: hoursAgo(5),
    image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    tags: ["Startups", "Venture Capital", "Investment"],
    reading_time: 5,
    views: 7230,
  },
  {
    id: "a6",
    title: "New Cybersecurity Regulations Set to Transform Data Protection Standards",
    summary: "European and American regulators announce unified cybersecurity frameworks that will require companies to adopt zero-trust architectures by 2027.",
    content_url: "#",
    source: sources[4],
    category: categories[0],
    author: "Alex Rivera",
    published_at: hoursAgo(6),
    image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80",
    tags: ["Cybersecurity", "Regulation", "Privacy"],
    reading_time: 6,
    views: 6100,
  },
  {
    id: "a7",
    title: "Global Mental Health Crisis Prompts WHO to Declare Priority Action Plan",
    summary: "The World Health Organization releases comprehensive guidelines as post-pandemic mental health challenges reach critical levels worldwide.",
    content_url: "#",
    source: sources[5],
    category: categories[4],
    author: "Dr. Aisha Patel",
    published_at: hoursAgo(7),
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tags: ["Mental Health", "WHO", "Healthcare"],
    reading_time: 9,
    views: 5640,
  },
  {
    id: "a8",
    title: "Space Tourism Enters Commercial Phase as Three Companies Launch Orbital Flights",
    summary: "Private space companies begin regular commercial flights, marking a new chapter in human space exploration and raising questions about regulatory oversight.",
    content_url: "#",
    source: sources[0],
    category: categories[3],
    author: "David Kim",
    published_at: hoursAgo(8),
    image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    tags: ["Space", "Tourism", "Commercial"],
    reading_time: 7,
    views: 11200,
  },
  {
    id: "a9",
    title: "Electric Vehicle Sales Surpass Combustion Engines in Major European Markets",
    summary: "Norway, Netherlands, and Sweden report that over 60% of new car sales are now fully electric, signaling an accelerating shift in transportation.",
    content_url: "#",
    source: sources[1],
    category: categories[0],
    author: "Maria Johansen",
    published_at: hoursAgo(9),
    image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    tags: ["EV", "Automotive", "Green Energy"],
    reading_time: 5,
    views: 8900,
  },
  {
    id: "a10",
    title: "Premier League Title Race Intensifies with Three Teams in Contention",
    summary: "With just eight matches remaining, Arsenal, Manchester City, and Liverpool are separated by only four points in one of the tightest title races in a decade.",
    content_url: "#",
    source: sources[5],
    category: categories[5],
    author: "Tom Bradley",
    published_at: hoursAgo(10),
    image_url: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",
    tags: ["Football", "Premier League", "Sports"],
    reading_time: 4,
    views: 14300,
  },
  {
    id: "a11",
    title: "Streaming Wars: New Platform Launches Challenge Industry Leaders",
    summary: "Two major media conglomerates announce new streaming services with exclusive content deals, intensifying competition in the saturated digital entertainment market.",
    content_url: "#",
    source: sources[4],
    category: categories[6],
    author: "Rachel Green",
    published_at: hoursAgo(11),
    image_url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
    tags: ["Streaming", "Entertainment", "Media"],
    reading_time: 6,
    views: 7800,
  },
  {
    id: "a12",
    title: "UN Security Council Addresses Rising Geopolitical Tensions in Southeast Asia",
    summary: "Emergency session convened as territorial disputes in the South China Sea escalate, with multiple nations calling for diplomatic intervention.",
    content_url: "#",
    source: sources[6],
    category: categories[2],
    author: "Omar Hassan",
    published_at: hoursAgo(12),
    image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    tags: ["Geopolitics", "UN", "Asia"],
    reading_time: 8,
    views: 6700,
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getArticlesByCategory(slug: string): Article[] {
  return articles.filter((a) => a.category.slug === slug);
}

export function getTrendingArticles(): Article[] {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, 6);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getArticlesBySource(sourceId: string, excludeId?: string): Article[] {
  return articles.filter((a) => a.source.id === sourceId && a.id !== excludeId);
}

export function getSourceCountForArticle(articleId: string): number {
  return getSourcesForArticle(articleId).length;
}

export function getSourcesForArticle(articleId: string): { source: Source; url: string }[] {
  // Simulate that some articles are published across multiple sources
  const hash = articleId.charCodeAt(articleId.length - 1);
  const count = 1 + (hash % 4); // 1-4 sources
  const article = getArticleById(articleId);
  if (!article) return [];

  // Always include the original source first, then pick others
  const result: { source: Source; url: string }[] = [
    { source: article.source, url: article.content_url },
  ];
  const otherSources = sources.filter((s) => s.id !== article.source.id);
  for (let i = 0; i < count - 1 && i < otherSources.length; i++) {
    result.push({ source: otherSources[i], url: "#" });
  }
  return result;
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export type TrendingPeriod = "now" | "week" | "month";

export function getTrendingByPeriod(period: TrendingPeriod): Article[] {
  const cutoff = new Date();
  if (period === "now") cutoff.setHours(cutoff.getHours() - 24);
  else if (period === "week") cutoff.setDate(cutoff.getDate() - 7);
  else cutoff.setMonth(cutoff.getMonth() - 1);

  return [...articles]
    .filter((a) => new Date(a.published_at) >= cutoff)
    .sort((a, b) => b.views - a.views);
}

export function getRisingArticles(excludeIds: string[] = []): Article[] {
  const scored = articles
    .filter((a) => !excludeIds.includes(a.id))
    .map((a) => {
      const hoursOld = Math.max(1, (Date.now() - new Date(a.published_at).getTime()) / 3600000);
      return { article: a, velocity: a.views / hoursOld };
    })
    .sort((a, b) => b.velocity - a.velocity);
  return scored.slice(0, 4).map((s) => s.article);
}

export function getVelocityLabel(article: Article): string {
  const hoursOld = Math.max(1, (Date.now() - new Date(article.published_at).getTime()) / 3600000);
  const velocity = Math.round(article.views / hoursOld);
  if (velocity > 1000) return `+${(velocity / 1000).toFixed(1)}K/h`;
  return `+${velocity}/h`;
}

export function getTrendingTags(): { tag: string; count: number }[] {
  const tagMap: Record<string, number> = {};
  articles.forEach((a) => a.tags.forEach((t) => (tagMap[t] = (tagMap[t] || 0) + 1)));
  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTopSources(): { source: Source; count: number }[] {
  const sourceMap: Record<string, { source: Source; count: number }> = {};
  const trending = getTrendingArticles();
  trending.forEach((a) => {
    if (!sourceMap[a.source.id]) {
      sourceMap[a.source.id] = { source: a.source, count: 0 };
    }
    sourceMap[a.source.id].count++;
  });
  // Also count from all articles for a richer leaderboard
  articles.forEach((a) => {
    if (!sourceMap[a.source.id]) {
      sourceMap[a.source.id] = { source: a.source, count: 0 };
    }
    sourceMap[a.source.id].count++;
  });
  return Object.values(sourceMap).sort((a, b) => b.count - a.count);
}

export function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export function getEditorsPicks(): Article[] {
  // Curate by highest reading time (in-depth, research-style articles)
  return [...articles].sort((a, b) => b.reading_time - a.reading_time).slice(0, 4);
}
