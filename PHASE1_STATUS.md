# Phase 1 Coverage Status

This document tracks the current implementation against the Phase 1 scope defined in `PRD/06-task-list.md`.

## Epic A — Foundations
- **A1. Project setup & theming** — _Partially complete_. Workspace, Tailwind, theming tokens, and mock `DataProvider` exist, but there is no Storybook, no automated lint/type CI, and no documented visual snapshots or Lighthouse coverage.
- **A2. Layout & navigation** — _Partially complete_. The top navigation, dark mode toggle, and page shells exist, yet hero slots are not wired for every screen, accessibility/responsive verification is absent, and keyboard/focus management lacks coverage.

## Epic B — Entities & Lists
- **B1. Circles index** — _Mostly complete_. Circle cards show base currency, computed balances, last activity, and navigate to detail views. Iconography, responsive QA, and real simplify toggles remain unimplemented.
- **B2. Friends index** — _Mostly complete_. Friend cards render with truncation, negative balance handling, status badges, and settle/invite CTAs. Avatar treatment and navigation to a friend detail surface are still missing.
- **B3. Activity feed** — _Mostly complete_. Activity items include scope badges, filter pills, type chips, unread indicators, and reset controls. Activity detail deep links and copy reviews are still outstanding.

## Epic C — Circle Detail
- **C1. Header + settings** — _Partially complete_. Detail route shows hero metrics, base currency badge, simplify state, and entry points to add expenses/settings, but dedicated settings panels and admin/member role controls are absent.
- **C2. Expenses table** — _Not yet started_. No sortable table, keyboard handlers, or expense detail navigation exist; recent expenses render as summary cards only.
- **C3. Activity (scoped)** — _Partially complete_. Scoped activity renders with recent events, yet lacks pagination, detail links, and empty-state education per PRD.

## Epic D — Expense Lifecycle
_Not implemented._ Add expense flow, expense detail, manual settlement UI, and associated activity updates are not built.

## Epic E — Recurring
_Partially implemented._ Circle detail surfaces recurring rules with status badges and cadence copy, but there is no dedicated create/edit flow or generated expense linkage.

## Epic F — Settings
_Not implemented._ Profile/security and circle settings surfaces are absent.

## Additional Definition of Done gaps
- Accessibility, responsiveness, and testing sign-offs from `PRD/10-definition-of-done.md` remain unmet.
- Storybook coverage called out in `PRD/12-storybook-checklist.md` is absent.

## Conclusion
Phase 1 remains **incomplete**. Core list views and the initial circle dashboard exist, but expenses workflows, settings, and Definition of Done requirements still need implementation.
