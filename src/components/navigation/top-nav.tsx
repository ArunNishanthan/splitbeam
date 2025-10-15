"use client";

import { CircleDollarSign, Clock3, Menu, Plus, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/navigation/mode-toggle";
import { useMockState } from "@/data/data-provider-context";
import { useActivityIndicator } from "@/lib/use-activity-indicator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/circles", label: "Circles", icon: CircleDollarSign },
  { href: "/friends", label: "Friends", icon: UsersRound },
  { href: "/activity", label: "Activity", icon: Clock3 },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const state = useMockState();
  const { hasUnseen } = useActivityIndicator(state.activity);
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/circles" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              SB
            </span>
            <span className="hidden sm:inline">SplitBeam</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname?.startsWith(link.href)
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" aria-hidden />
                <span className="relative inline-flex items-center">
                  {link.label}
                  {link.href === "/activity" && hasUnseen ? (
                    <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_0_2px] shadow-background" />
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="#">
              <Plus className="mr-2 h-4 w-4" />
              Add expense
            </Link>
          </Button>
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-border/60 bg-background/95 shadow-sm md:hidden">
          <div className="container flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname?.startsWith(link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" aria-hidden />
                <span className="relative inline-flex items-center">
                  {link.label}
                  {link.href === "/activity" && hasUnseen ? (
                    <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_0_2px] shadow-background" />
                  ) : null}
                </span>
              </Link>
            ))}
            <Button variant="secondary" className="mt-2" asChild>
              <Link href="#">
                <Plus className="mr-2 h-4 w-4" />
                Add expense
              </Link>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
