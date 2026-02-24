export interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  renewal_date: string;
  status: "active" | "trialing" | "past_due" | "canceled";
}

export interface PlanOption {
  id: string;
  name: string;
  price: number;
  price_label: string;
  features: string[];
  is_popular?: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key_masked: string;
  full_key: string;
  created_at: string;
  last_used: string | null;
  status: "active" | "revoked";
  created_by: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  plan_name: string;
}

export interface UsageStat {
  date: string;
  calls: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  icon_type: "key" | "user" | "billing" | "settings";
}