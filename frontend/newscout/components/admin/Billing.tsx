"use client";
import { motion } from "framer-motion";
import { Check, CreditCard, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  organization,
  invoices,
  planOptions,
  paymentMethod,
} from "@/utils/admin-mock-data";
import { cn } from "@/utils/utils"; 

const statusColors: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-700 border-amber-200",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const Billing = () => {
  const { plan } = organization;

  return (
    <motion.div
      className="mx-auto max-w-5xl space-y-8"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-foreground">
          Billing & Subscriptions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your plan, payment method, and invoices.
        </p>
      </motion.div>

      {/* Current plan */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Current Plan
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {plan.name}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 border-emerald-200"
                >
                  {plan.status === "active" ? "Active" : plan.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ${plan.price}/mo · Renews{" "}
                {new Date(plan.renewal_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan comparison */}
      <motion.div variants={fadeUp}>
        <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
          Compare Plans
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {planOptions.map((option) => {
            const isCurrent = option.id === plan.id;
            return (
              <Card
                key={option.id}
                className={cn(
                  "relative transition-shadow",
                  isCurrent && "border-primary shadow-md",
                  option.is_popular && !isCurrent && "border-accent/40",
                )}
              >
                {option.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-foreground">
                    {option.price_label}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {option.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={option.is_popular ? "default" : "outline"}
                      className="w-full"
                    >
                      {option.price > plan.price || option.price === -1
                        ? "Upgrade"
                        : "Downgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Payment method */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Visa ending in {paymentMethod.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {paymentMethod.exp}
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Update
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoice history */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice History</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-[520px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm">
                      {new Date(inv.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inv.plan_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${inv.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[inv.status]}
                      >
                        {inv.status.charAt(0).toUpperCase() +
                          inv.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Billing;
