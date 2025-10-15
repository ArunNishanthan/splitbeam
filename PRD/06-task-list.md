# 06 — Task List (UI-first with Mock Backend)

## Epic A: Foundations
### A1. Project setup & theming
- Repo scaffold, Tailwind, shadcn/ui, dark mode tokens, DataProvider mock.
- AC: dark mode switch; visual snapshots; mock data returns.
- DoD: CI lint/typecheck; Storybook core components; Lighthouse a11y ≥ 90.

### A2. Layout & navigation
- Top nav with icons, mobile overflow, Add Expense CTA, page shell with hero slot.
- AC: routes and hero for all screens; keyboard nav; focus rings.
- DoD: responsive checks (sm/md/lg).

## Epic B: Entities & Lists
### B1. Circles index
- Cards with icon, base currency, balance, last activity.
- AC: click opens Circle detail; dark mode parity.

### B2. Friends index
- Avatar cards; Invite CTA.
- AC: negative balances show leading minus; long emails truncate with title.

### B3. Activity feed
- Filter pills, tag chips, in-app indicator reset on view.
- AC: shows defined activity types; copy correct.

## Epic C: Circle Detail
### C1. Header + settings
- Base currency badge, simplify state, Add Expense.
- AC: admin sees Delete Circle in Settings; member cannot.

### C2. Expenses table
- Columns, right-aligned numeric; row opens detail; keyboard handlers.
- AC: converted shows symbol+amount+code only when present.

### C3. Activity (scoped)
- Feed filtered to circle.

## Epic D: Expense Lifecycle
### D1. Add Expense screen
- Sections; validation; invite flow block until signup.
- AC: conversion requires target + rate; both amounts shown; Activity created.

### D2. Expense detail
- Tiles; comments; attachments; hard delete with audit.
- AC: hard delete removes list item and adds non-interactive Activity line.

### D3. Manual settlement
- Settlement form; Activity entry; balances update.

## Epic E: Recurring
### E1. Rules list & management
- Create/edit; pause/resume/skip.
- AC: first run future-only; edits future-only; Activity logs.

### E2. Generated expenses
- Link rule -> generated expenses; past instance editable.

## Epic F: Settings
### F1. Profile & security
- Name, preferred currency, social links (UI only), change password (UI only).

### F2. Circle settings
- Base currency change; optional historical conversion with manual rate; simplify toggle.
- AC: if convert history, require rate; Activity conversion logged.
