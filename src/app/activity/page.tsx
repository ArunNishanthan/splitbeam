"use client";

import { BellMinus, CheckCircle2, Filter, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { AppShell, SectionHeader } from "@/components/layouts/app-shell";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataProvider, useMockState } from "@/data/data-provider-context";
import { cn, formatRelativeDate } from "@/lib/utils";
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

const scopeOptions = [
  { label: "All", value: "all" },
  { label: "Circles", value: "circle" },
  { label: "Friends", value: "friend" },
] as const;

const STORAGE_KEY = "activity:lastSeenAt";

function ScopeBadge({ scope }: { scope: Activity["scope"] }) {
  if (scope.type === "global") {
    return <Badge variant="outline">Global</Badge>;
  }
  return <Badge variant="outline">{scope.type === "circle" ? "Circle" : "Friend"}</Badge>;
}

export default function ActivityPage() {
  const provider = useDataProvider();
  const state = useMockState();
  const [scope, setScope] = React.useState<("all" | "circle" | "friend")>("all");
  const [typeFilters, setTypeFilters] = React.useState<Activity["type"][]>([]);
  const [allActivities, setAllActivities] = React.useState<Activity[]>(
    [...state.activity].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  );
  const [lastSeenAt, setLastSeenAt] = React.useState<string>(() => {
    if (typeof window === "undefined") {
      return new Date(0).toISOString();
    }
    return window.localStorage.getItem(STORAGE_KEY) ?? new Date(0).toISOString();
  });

  React.useEffect(() => {
    const filters = scope === "all" ? undefined : { scope: { type: scope } as const };
    provider.activity
      .list(filters)
      .then((items) =>
        setAllActivities(
          [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        ),
      )
      .catch((error) => console.error("Failed to load activity", error));
  }, [provider.activity, scope]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, lastSeenAt);
  }, [lastSeenAt]);

  const availableTypes = React.useMemo(() => {
    const set = new Set(allActivities.map((item) => item.type));
    return (Object.keys(typeLabels) as Activity["type"][]).filter((type) => set.has(type));
  }, [allActivities]);

  const filteredActivities = React.useMemo(() => {
    if (!typeFilters.length) return allActivities;
    return allActivities.filter((item) => typeFilters.includes(item.type));
  }, [allActivities, typeFilters]);

  const unreadCount = React.useMemo(() => {
    if (!lastSeenAt) return 0;
    const lastSeenMs = new Date(lastSeenAt).getTime();
    return allActivities.filter((item) => new Date(item.created_at).getTime() > lastSeenMs).length;
  }, [allActivities, lastSeenAt]);

  const heroCopy = React.useMemo(() => {
    const base = `Tracking ${state.activity.length} events across ${state.circles.length} circles.`;
    if (unreadCount > 0) {
      return `${base} ${unreadCount} new ${unreadCount === 1 ? "event" : "events"} since your last visit.`;
    }
    return `${base} You're all caught up.`;
  }, [state.activity.length, state.circles.length, unreadCount]);

  const handleResetFilters = () => {
    setScope("all");
    setTypeFilters([]);
  };

  const toggleTypeFilter = (type: Activity["type"]) => {
    setTypeFilters((prev) => (prev.includes(type) ? prev.filter((value) => value !== type) : [...prev, type]));
  };

  const handleResetIndicator = () => {
    setLastSeenAt(new Date().toISOString());
  };

  return (
    <AppShell
      title="Activity"
      description="Everything that happened across circles, friends, and settlements."
      hero={heroCopy}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
          <Button
            size="sm"
            onClick={handleResetIndicator}
            variant={unreadCount ? "default" : "outline"}
            disabled={!unreadCount}
          >
            <BellMinus className="mr-2 h-4 w-4" />
            Mark all viewed
          </Button>
        </div>
      }
    >
      <SectionHeader
        title="Timeline"
        description="Newest events appear first."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {scopeOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={scope === option.value ? "default" : "ghost"}
                className="rounded-full"
                onClick={() => setScope(option.value)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {option.label}
              </Button>
            ))}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {availableTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleTypeFilter(type)}
            className={cn(
              badgeVariants({ variant: typeFilters.includes(type) ? "default" : "outline" }),
              "cursor-pointer select-none",
            )}
            aria-pressed={typeFilters.includes(type)}
          >
            {typeLabels[type]}
          </button>
        ))}
        {!availableTypes.length ? (
          <span className="text-xs text-muted-foreground">No activity yet to filter.</span>
        ) : null}
      </div>

      <div className="space-y-4">
        {filteredActivities.map((item) => {
          const scopeLabel =
            item.scope.type === "circle" && item.scope.id
              ? state.circles.find((circle) => circle.id === item.scope.id)?.name ?? "Circle"
              : item.scope.type === "friend" && item.scope.id
              ? state.friends.find((friend) => friend.id === item.scope.id)?.email ?? "Friend"
              : "Global";
          const isUnread = lastSeenAt
            ? new Date(item.created_at).getTime() > new Date(lastSeenAt).getTime()
            : false;

          return (
            <Card key={item.id} className="border-border/70">
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{typeLabels[item.type]}</Badge>
                    <ScopeBadge scope={item.scope} />
                    {isUnread ? <Badge variant="success">New</Badge> : null}
                  </div>
                  <p className="text-sm text-foreground">{item.message}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatRelativeDate(item.created_at)}</span>
                    <span>• {scopeLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  {scopeLabel}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!filteredActivities.length ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
            No activity yet. When expenses are created or settled, they'll appear here.
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
