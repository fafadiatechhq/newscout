import type { AdminUser, TeamMember, Organization } from "@/types/users";
import type { Plan, PlanOption, ApiKey, Invoice, UsageStat, ActivityItem } from "@/types/plan";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const currentUser: AdminUser = {
  id: "u1",
  name: "Sarah Chen",
  email: "sarah@newscout.io",
  role: "owner",
  avatar_initials: "SC",
};

export const organization: Organization = {
  id: "org1",
  name: "NewScout Media",
  plan: {
    id: "pro-team",
    name: "Pro Team",
    price: 50,
    billing_cycle: "monthly",
    renewal_date: "2026-03-07",
    status: "active",
  },
  seat_limit: 10,
  created_at: "2025-06-15T00:00:00Z",
};

export const teamMembers: TeamMember[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah@newscout.io", role: "owner", status: "active", joined_at: "2025-06-15", avatar_initials: "SC" },
  { id: "u2", name: "Michael Torres", email: "michael@newscout.io", role: "admin", status: "active", joined_at: "2025-07-20", avatar_initials: "MT" },
  { id: "u3", name: "Emily Park", email: "emily@newscout.io", role: "admin", status: "active", joined_at: "2025-08-10", avatar_initials: "EP" },
  { id: "u4", name: "James Wright", email: "james@newscout.io", role: "viewer", status: "pending", joined_at: "2026-01-28", avatar_initials: "JW" },
];

export const apiKeys: ApiKey[] = [
  { id: "k1", name: "Production API", key_masked: "ns_****7f3a", full_key: "ns_live_8x2k4m9p1r5t7f3a", created_at: "2025-09-01", last_used: daysAgo(0), status: "active", created_by: "Sarah Chen" },
  { id: "k2", name: "Staging API", key_masked: "ns_****b2e9", full_key: "ns_test_3j6h8n2w4q7y9b2e9", created_at: "2025-10-15", last_used: daysAgo(1), status: "active", created_by: "Michael Torres" },
  { id: "k3", name: "Old Integration", key_masked: "ns_****d4c1", full_key: "ns_live_5m1k7p3r9t2x4d4c1", created_at: "2025-07-20", last_used: daysAgo(45), status: "revoked", created_by: "Sarah Chen" },
];

export const invoices: Invoice[] = [
  { id: "inv-006", date: "2026-02-01", amount: 50, status: "paid", plan_name: "Pro Team" },
  { id: "inv-005", date: "2026-01-01", amount: 50, status: "paid", plan_name: "Pro Team" },
  { id: "inv-004", date: "2025-12-01", amount: 50, status: "paid", plan_name: "Pro Team" },
  { id: "inv-003", date: "2025-11-01", amount: 50, status: "paid", plan_name: "Pro Team" },
  { id: "inv-002", date: "2025-10-01", amount: 10, status: "paid", plan_name: "Pro Individual" },
  { id: "inv-001", date: "2025-09-01", amount: 10, status: "paid", plan_name: "Pro Individual" },
];

export const activityFeed: ActivityItem[] = [
  { id: "act1", action: "API key 'Production API' used 1,240 times today", actor: "System", timestamp: daysAgo(0), icon_type: "key" },
  { id: "act2", action: "James Wright invited to team", actor: "Sarah Chen", timestamp: daysAgo(2), icon_type: "user" },
  { id: "act3", action: "Monthly invoice paid — $50.00", actor: "System", timestamp: daysAgo(6), icon_type: "billing" },
  { id: "act4", action: "API key 'Old Integration' revoked", actor: "Sarah Chen", timestamp: daysAgo(12), icon_type: "key" },
  { id: "act5", action: "Plan upgraded to Pro Team", actor: "Sarah Chen", timestamp: daysAgo(30), icon_type: "settings" },
];

// 30-day usage data
export const usageStats: UsageStat[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now.getTime() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  calls: Math.floor(800 + Math.random() * 600 + (i * 20)),
}));

// Daily API requests per key (last 14 days)
export const keyUsageStats: Record<string, UsageStat[]> = {
  k1: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(now.getTime() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    calls: Math.floor(600 + Math.random() * 800),
  })),
  k2: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(now.getTime() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    calls: Math.floor(100 + Math.random() * 300),
  })),
  k3: [],
};

export const planOptions: PlanOption[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    price_label: "$0/mo",
    features: ["100 API calls/day", "1 team member", "Basic analytics", "Community support"],
  },
  {
    id: "pro-individual",
    name: "Pro Individual",
    price: 10,
    price_label: "$10/mo",
    features: ["5,000 API calls/day", "1 team member", "Advanced analytics", "Email support", "Custom webhooks"],
  },
  {
    id: "pro-team",
    name: "Pro Team",
    price: 50,
    price_label: "$50/mo",
    is_popular: true,
    features: ["10,000 API calls/day", "Up to 10 team members", "Advanced analytics", "Priority support", "Custom webhooks", "SSO integration"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: -1,
    price_label: "Custom",
    features: ["Unlimited API calls", "Unlimited team members", "Dedicated analytics", "24/7 phone support", "Custom integrations", "SLA guarantee", "Dedicated account manager"],
  },
];

// Helpers
export const paymentMethod = {
  type: "visa" as const,
  last4: "4242",
  exp: "08/27",
};

export function getActiveTeamCount(): number {
  return teamMembers.filter((m) => m.status === "active").length;
}

export function getActiveKeyCount(): number {
  return apiKeys.filter((k) => k.status === "active").length;
}

export function getTotalApiCalls(): number {
  return usageStats.reduce((sum, s) => sum + s.calls, 0);
}

export function getRateLimit(): { used: number; limit: number } {
  const todayCalls = usageStats[usageStats.length - 1]?.calls ?? 0;
  return { used: todayCalls, limit: 10000 };
}
