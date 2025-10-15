"use client";

import { MailPlus, UserRoundMinus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AppShell, SectionHeader } from "@/components/layouts/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataProvider, useMockState } from "@/data/data-provider-context";
import { formatCurrency } from "@/lib/utils";
import type { Friend } from "@/types/entities";

function useFriends() {
  const provider = useDataProvider();
  const [friends, setFriends] = React.useState<Friend[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    provider.friends
      .list()
      .then((items) => {
        if (!isMounted) return;
        setFriends(items);
      })
      .catch((error) => console.error("Failed to load friends", error));
    return () => {
      isMounted = false;
    };
  }, [provider]);

  return friends;
}

export default function FriendsPage() {
  const friends = useFriends();
  const state = useMockState();

  const hero = friends.length
    ? `You have ${friends.length} friends syncing with SplitBeam.`
    : "Invite a friend to split something small before the big trip.";

  return (
    <AppShell
      title="Friends"
      description="Keep tabs on running balances with people outside your circles."
      hero={hero}
      actions={
        <Button asChild>
          <Link href="#">
            <MailPlus className="mr-2 h-4 w-4" />
            Invite friend
          </Link>
        </Button>
      }
    >
      <SectionHeader title="Balances" description="Negative amounts mean you owe them." />
      {friends.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {friends.map((friend) => {
            const friendExpenses = state.expenses.filter(
              (expense) => expense.scope.type === "friend" && expense.scope.id === friend.id,
            );
            const amount = friendExpenses.reduce((sum, expense) => sum + expense.amount_base, 0);
            const preferredCurrency = state.profiles.find(
              (profile) => profile.user_id === state.currentUser.id,
            )?.preferred_currency;
            const formatted = formatCurrency(Math.abs(amount), preferredCurrency ?? "USD");
            const isNegative = amount < 0;
            return (
              <Card key={friend.id}>
                <CardHeader>
                  <CardTitle className="truncate" title={friend.email}>
                    {friend.email}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    {friend.status === "active" ? <Badge variant="success">Active</Badge> : <Badge>Invited</Badge>}
                    {friend.status === "invited" ? <span>Awaiting signup</span> : null}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-0">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Balance</p>
                    <p className="text-2xl font-semibold">
                      {isNegative ? "-" : ""}
                      {formatted}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="#">
                      <UserRoundMinus className="mr-2 h-4 w-4" />
                      Settle up
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center">
          <h3 className="text-lg font-semibold">No friends yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Invite a friend to start splitting tabs outside of a circle.
          </p>
          <Button className="mt-4" asChild>
            <Link href="#">
              <MailPlus className="mr-2 h-4 w-4" /> Invite friend
            </Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
