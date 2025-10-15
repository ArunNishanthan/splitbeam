import * as React from "react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  description?: string;
  hero?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ title, description, hero, actions, children }: AppShellProps) {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            {description ? <p className="max-w-2xl text-base text-muted-foreground">{description}</p> : null}
            {hero ? <div className="pt-3 text-sm text-muted-foreground">{hero}</div> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
        </div>
      </section>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
