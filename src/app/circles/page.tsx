"use client";

import Link from "next/link";
import * as React from "react";

import { AppShell, SectionHeader } from "@/components/layouts/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataProvider, useMockState } from "@/data/data-provider-context";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import type { Circle } from "@/types/entities";

function useCircles() {
  const provider = useDataProvider();
  const [circles, setCircles] = React.useState<Circle[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    provider.circles
      .list()
      .then((items) => {
        if (!isMounted) return;
        setCircles(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load circles", error);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [provider]);

  return { circles, loading };
}

export default function CirclesPage() {
  const { circles, loading } = useCircles();
  const state = useMockState();

  const hero = React.useMemo(() => {
    if (!circles.length) {
      return "Create your first circle to start tracking shared costs.";
    }
    const totalExpenses = state.expenses.reduce((acc, expense) => acc + expense.amount_base, 0);
    return `Tracking ${circles.length} circles with ${state.expenses.length} expenses worth ${formatCurrency(
      totalExpenses,
      circles[0]?.base_currency ?? "USD",
    )}.`;
  }, [circles, state.expenses]);

  return (
    <AppShell
      title="Circles"
      description="Group expenses, set a base currency, and keep the crew aligned before money hits the table."
      hero={hero}
      actions={
        <Button asChild>
          <Link href="#">Create circle</Link>
        </Button>
      }
    >
      <SectionHeader
        title="Active circles"
        description="Balances shown in the circle base currency."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/activity">View activity</Link>
          </Button>
        }
      />
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
          ))}
        </div>
      ) : circles.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {circles.map((circle) => {
            const circleExpenses = state.expenses.filter(
              (expense) => expense.scope.type === "circle" && expense.scope.id === circle.id,
            );
            const settlements = state.settlements.filter(
              (settlement) => settlement.scope.type === "circle" && settlement.scope.id === circle.id,
            );
            const expenseTotal = circleExpenses.reduce((sum, expense) => sum + expense.amount_base, 0);
            const settlementTotal = settlements.reduce((sum, settlement) => sum + settlement.amount, 0);
            const balance = expenseTotal - settlementTotal;
            const latestActivity = [...state.activity]
              .filter((item) => item.scope.type === "circle" && item.scope.id === circle.id)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
            return (
              <Card key={circle.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle>{circle.name}</CardTitle>
                      <CardDescription>Base currency · {circle.base_currency}</CardDescription>
                    </div>
                    <Badge variant={circle.simplify_on ? "success" : "outline"}>
                      {circle.simplify_on ? "Simplify on" : "Simplify off"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-0">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Balance</p>
                    <p className="text-2xl font-semibold">
                      {formatCurrency(balance, circle.base_currency)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {latestActivity ? `Last activity ${formatRelativeDate(latestActivity.created_at)}` : "No recent activity"}
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/circles/${circle.id}`}>Open circle</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center">
          <h3 className="text-lg font-semibold">No circles yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first circle to organize expenses and track who owes what.
          </p>
          <Button className="mt-4" asChild>
            <Link href="#">Create circle</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
