import type { Plan } from "@/types/plan";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "viewer";
  avatar_initials: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "viewer";
  status: "active" | "pending";
  joined_at: string;
  avatar_initials: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: Plan;
  seat_limit: number;
  created_at: string;
}
