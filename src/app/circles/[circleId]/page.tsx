"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { AppShell, SectionHeader } from "@/components/layouts/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataProvider, useMockState } from "@/data/data-provider-context";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { Activity, Circle, Expense, RecurringRule, Settlement } from "@/types/entities";

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-xl border border-border/60 bg-muted/20" />
        ))}
      </div>
    </div>
  );
}

type MemberSummary = {
  id: string;
  label: string;
  statusLabel: string;
  statusVariant: "success" | "outline" | "warning";
  totalPaid: number;
  expensesTouched: number;
};

function buildMemberSummaries(
  circleId: string,
  expenses: Expense[],
  settlements: Settlement[],
  activity: Activity[],
  options: {
    currentUserId: string;
    currentUserName?: string;
    currentUserEmail: string;
    friends: ReturnType<typeof useMockState>["friends"];
  },
): MemberSummary[] {
  const memberIds = new Set<string>();
  memberIds.add(options.currentUserId);

  for (const expense of expenses) {
    expense.payers.forEach((payer) => memberIds.add(payer.user_id));
    if (expense.split.shares) {
      Object.keys(expense.split.shares).forEach((id) => memberIds.add(id));
    }
    memberIds.add(expense.created_by);
  }

  for (const settlement of settlements) {
    memberIds.add(settlement.from_user);
    memberIds.add(settlement.to_user);
  }

  for (const item of activity) {
    if (item.scope.type === "circle" && item.scope.id === circleId) {
      memberIds.add(item.actor_user_id);
    }
  }

  const friendIndex = new Map(options.friends.map((friend) => [friend.id, friend] as const));

  return Array.from(memberIds)
    .filter(Boolean)
    .map((id) => {
      if (id === options.currentUserId) {
        return {
          id,
          label: options.currentUserName ?? options.currentUserEmail,
          statusLabel: "You",
          statusVariant: "success" as const,
          totalPaid: expenses.reduce((total, expense) => {
            const payer = expense.payers.find((entry) => entry.user_id === id);
            return total + (payer?.amount ?? 0);
          }, 0),
          expensesTouched: expenses.filter(
            (expense) =>
              expense.created_by === id ||
              expense.payers.some((payer) => payer.user_id === id) ||
              Boolean(expense.split.shares?.[id]),
          ).length,
        } satisfies MemberSummary;
      }

      const friend = friendIndex.get(id);
      const label = friend?.email ?? `Member ${id.slice(0, 6)}`;
      const statusLabel = friend ? (friend.status === "active" ? "Active" : "Invited") : "Guest";
      const statusVariant = friend
        ? (friend.status === "active" ? "outline" : "warning")
        : "outline";

      return {
        id,
        label,
        statusLabel,
        statusVariant,
        totalPaid: expenses.reduce((total, expense) => {
          const payer = expense.payers.find((entry) => entry.user_id === id);
          return total + (payer?.amount ?? 0);
        }, 0),
        expensesTouched: expenses.filter(
          (expense) =>
            expense.created_by === id ||
            expense.payers.some((payer) => payer.user_id === id) ||
            Boolean(expense.split.shares?.[id]),
        ).length,
      } satisfies MemberSummary;
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function RecurringList({ rules }: { rules: RecurringRule[] }) {
  if (!rules.length) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-sm text-muted-foreground">
        No recurring expenses configured for this circle.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <Card key={rule.id} className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{rule.template_expense.title}</CardTitle>
            <CardDescription>
              Runs {rule.cadence === "custom" ? "on custom cadence" : `every ${rule.cadence}`} · Next {" "}
              {formatRelativeDate(rule.next_run)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={rule.status === "active" ? "success" : "outline"} className="uppercase">
              {rule.status === "active" ? "Active" : "Paused"}
            </Badge>
            <span>
              Amount {formatCurrency(rule.template_expense.amount_base, rule.template_expense.currency_base)} split via{" "}
              {rule.template_expense.split.method}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CircleDetailPage() {
  const params = useParams<{ circleId: string }>();
  const circleId = params?.circleId ?? "";
  const provider = useDataProvider();
  const state = useMockState();
  const [circle, setCircle] = React.useState<Circle | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!circleId) return;
    let isMounted = true;
    setLoading(true);
    provider.circles
      .get(circleId)
      .then((result) => {
        if (!isMounted) return;
        setCircle(result);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load circle", err);
        if (!isMounted) return;
        setCircle(null);
        setError("Circle not found");
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [circleId, provider.circles]);

  const circleExpenses = React.useMemo(
    () => state.expenses.filter((expense) => expense.scope.type === "circle" && expense.scope.id === circleId),
    [circleId, state.expenses],
  );

  const circleSettlements = React.useMemo(
    () => state.settlements.filter((settlement) => settlement.scope.type === "circle" && settlement.scope.id === circleId),
    [circleId, state.settlements],
  );

  const circleActivity = React.useMemo(
    () =>
      [...state.activity]
        .filter((item) => item.scope.type === "circle" && item.scope.id === circleId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [circleId, state.activity],
  );

  const recurringRules = React.useMemo(
    () => state.recurring.filter((rule) => rule.scope.type === "circle" && rule.scope.id === circleId),
    [circleId, state.recurring],
  );

  const totalExpenses = React.useMemo(
    () => circleExpenses.reduce((total, expense) => total + expense.amount_base, 0),
    [circleExpenses],
  );

  const totalSettlements = React.useMemo(
    () => circleSettlements.reduce((total, settlement) => total + settlement.amount, 0),
    [circleSettlements],
  );

  const outstandingBalance = totalExpenses - totalSettlements;

  const memberSummaries = React.useMemo(
    () =>
      buildMemberSummaries(circleId, circleExpenses, circleSettlements, circleActivity, {
        currentUserId: state.currentUser.id,
        currentUserName: state.currentUser.name,
        currentUserEmail: state.currentUser.email,
        friends: state.friends,
      }),
    [circleActivity, circleExpenses, circleId, circleSettlements, state.currentUser.email, state.currentUser.id, state.currentUser.name, state.friends],
  );

  const hero = React.useMemo(() => {
    if (!circle) {
      if (loading) return "Fetching circle stats…";
      return error ?? "";
    }
    const createdAt = formatRelativeDate(circle.created_at);
    const memberCount = memberSummaries.length;
    return `Created ${createdAt} · ${memberCount} member${memberCount === 1 ? "" : "s"}`;
  }, [circle, error, loading, memberSummaries.length]);

  const title = circle ? circle.name : error ? "Circle unavailable" : "Loading circle";
  const description = circle
    ? "Review balances, members, and recent activity for this shared space."
    : "";

  return (
    <AppShell
      title={title}
      description={description}
      hero={hero}
      actions={
        circle ? (
          <>
            <Badge variant="outline" className="uppercase">
              Base · {circle.base_currency}
            </Badge>
            <Badge variant={circle.simplify_on ? "success" : "outline"}>
              {circle.simplify_on ? "Simplify on" : "Simplify off"}
            </Badge>
            <Button size="sm" variant="outline" asChild>
              <Link href="/activity">View circle activity</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="#">Add expense</Link>
            </Button>
          </>
        ) : null
      }
    >
      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          {error}. Double-check the link or return to the circles list.
        </div>
      ) : circle ? (
        <div className="space-y-10">
          <section className="space-y-6">
            <SectionHeader
              title="Overview"
              description="At-a-glance metrics for this circle."
              action={
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/circles/${circle.id}/settings`}>Manage settings</Link>
                </Button>
              }
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardDescription>Total logged</CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {formatCurrency(totalExpenses, circle.base_currency)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Across {circleExpenses.length} expense{circleExpenses.length === 1 ? "" : "s"}
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardDescription>Settled</CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {formatCurrency(totalSettlements, circle.base_currency)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {circleSettlements.length ? `${circleSettlements.length} settlement${circleSettlements.length === 1 ? "" : "s"}` : "No settlements yet"}
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardDescription>Outstanding</CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {formatCurrency(outstandingBalance, circle.base_currency)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Settlements needed to zero the balance
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardDescription>Recurring rules</CardDescription>
                  <CardTitle className="text-2xl font-semibold">{recurringRules.length}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {recurringRules.length ? "Automating your regular expenses" : "Add rules to automate rent or utilities"}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeader
              title="Recent expenses"
              description="The latest costs logged in this circle."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="#">View all expenses</Link>
                </Button>
              }
            />
            {circleExpenses.length ? (
              <div className="space-y-4">
                {circleExpenses.slice(0, 5).map((expense) => (
                  <Card key={expense.id} className="border-border/70">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-base font-semibold">{expense.title}</CardTitle>
                          <CardDescription>
                            Logged {formatRelativeDate(expense.created_at)} by{" "}
                            {expense.created_by === state.currentUser.id
                              ? 'you'
                              : memberSummaries.find((member) => member.id === expense.created_by)?.label ?? 'someone'}
                          </CardDescription>
                        </div>
             <Badge variant="outline" className="uppercase">
                          {expense.split.method}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-medium text-foreground">
                        {formatCurrency(expense.amount_base, expense.currency_base)}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {expense.payers.map((payer) => {
                          const member = memberSummaries.find((item) => item.id === payer.user_id);
                          return (
                 <Badge key={payer.user_id} variant="outline">
                              {member ? member.label : payer.user_id}
                              {payer.amount ? ` · ${formatCurrency(payer.amount, expense.currency_base)}` : ''}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No expenses yet. Start by adding the first shared cost.
              </div>
            )}
          </section>

          <section className="space-y-6">
            <SectionHeader title="Members" description="People contributing to this circle." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {memberSummaries.map((member) => (
                <Card key={member.id} className="border-border/70">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base font-semibold">{member.label}</CardTitle>
                      <Badge variant={member.statusVariant}>{member.statusLabel}</Badge>
                    </div>
                    <CardDescription>
                      Involved in {member.expensesTouched} expense{member.expensesTouched === 1 ? '' : 's'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Paid {formatCurrency(member.totalPaid, circle.base_currency)} so far
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeader
              title="Recurring"
              description="Rules that automatically create expenses."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="#">Manage recurring</Link>
                </Button>
              }
            />
            <RecurringList rules={recurringRules} />
          </section>

          <section className="space-y-6">
            <SectionHeader title="Activity" description="What happened recently in this circle." />
            {circleActivity.length ? (
              <div className="space-y-3">
                {circleActivity.slice(0, 8).map((item) => (
                  <Card key={item.id} className="border-border/70">
                    <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
               <Badge variant="outline">{item.type.replace(/_/g, ' ')}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(item.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{item.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No activity just yet.
              </div>
            )}
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
