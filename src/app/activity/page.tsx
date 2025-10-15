"use client";

import { CheckCircle2, Filter } from "lucide-react";
import * as React from "react";

import { AppShell, SectionHeader } from "@/components/layouts/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataProvider, useMockState } from "@/data/data-provider-context";
import { formatRelativeDate } from "@/lib/utils";
import type { Activity } from "@/types/entities";

const typeLabels: Record<Activity["type"], string> = {
  expense_add: "Expense added",
  expense_edit: "Expense updated",
  expense_delete: "Expense removed",
  conversion: "Conversion",
  recurring_add: "Recurring added",
  recurring_edit: "Recurring updated",
  recurring_pause: "Recurring paused",
  recurring_skip: "Recurring skipped",
  member_join: "Member joined",
  member_leave: "Member left",
  settlement: "Settlement",
  circle_delete: "Circle deleted",
};

const scopes = [
  { label: "All", value: "all" },
  { label: "Circles", value: "circle" },
  { label: "Friends", value: "friend" },
] as const;

export default function ActivityPage() {
  const provider = useDataProvider();
  const state = useMockState();
  const [scope, setScope] = React.useState<("all" | "circle" | "friend")>("all");
  const [activities, setActivities] = React.useState<Activity[]>(
    [...state.activity].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  );

  React.useEffect(() => {
    const filters = scope === "all" ? undefined : { scope: { type: scope } as const };
    provider.activity
      .list(filters)
      .then((items) =>
        setActivities(
          [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        ),
      )
      .catch((error) => console.error("Failed to load activity", error));
  }, [provider, scope]);

  return (
    <AppShell
      title="Activity"
      description="Everything that happened across circles, friends, and settlements."
      hero={`Tracking ${state.activity.length} events across ${state.circles.length} circles.`}
      actions={
        <Button variant="outline" size="sm" onClick={() => setScope("all")}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset filters
        </Button>
      }
    >
      <SectionHeader
        title="Timeline"
        description="Newest events appear first."
        action={
          <div className="flex gap-2">
            {scopes.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={scope === option.value ? "default" : "ghost"}
                onClick={() => setScope(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        }
      />
      <div className="space-y-4">
        {activities.map((item) => (
          <Card key={item.id} className="border-border/70">
            <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{typeLabels[item.type]}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeDate(item.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-foreground">{item.message}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {item.scope.type === "circle" && item.scope.id
                  ? state.circles.find((circle) => circle.id === item.scope.id)?.name ?? "Circle"
                  : item.scope.type === "friend" && item.scope.id
                  ? state.friends.find((friend) => friend.id === item.scope.id)?.email ?? "Friend"
                  : "Global"}
              </div>
            </CardContent>
          </Card>
        ))}
        {!activities.length ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
            No activity yet. When expenses are created or settled, they'll appear here.
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
