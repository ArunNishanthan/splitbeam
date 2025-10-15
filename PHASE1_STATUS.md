# Phase 1 Coverage Status

This document tracks the current implementation against the Phase 1 scope defined in `PRD/06-task-list.md`.

## Epic A — Foundations
- **A1. Project setup & theming** — _Partially complete_. Workspace, Tailwind, theming tokens, and mock `DataProvider` exist, but there is no Storybook, no automated lint/type CI, and no documented visual snapshots or Lighthouse coverage.
- **A2. Layout & navigation** — _Partially complete_. The top navigation and dark mode toggle are implemented, yet there is no hero slot wiring for every screen, no responsive verification, and no keyboard/focus management tests or docs.

## Epic B — Entities & Lists
- **B1. Circles index** — _Partially complete_. Circle list cards render with metadata, but they do not navigate to detail views and balance/last-activity logic is stubbed.
- **B2. Friends index** — _Partially complete_. Friend cards and Invite CTA render, yet negative balances, truncation behaviour, and navigation affordances are not implemented.
- **B3. Activity feed** — _Partially complete_. Activity items render, but filter pills, tag chips, and in-app indicator reset logic are missing.

## Epic C — Circle Detail
_No implementation present._ There are no Circle detail routes, headers, settings panels, or scoped activity/expense views.

## Epic D — Expense Lifecycle
_No implementation present._ Add expense flow, expense detail, manual settlement UI, and associated activity updates are not built.

## Epic E — Recurring
_No implementation present._ There are no recurring rule lists, management screens, or generated expense views.

## Epic F — Settings
_No implementation present._ Profile/security and circle settings surfaces are absent.

## Additional Definition of Done gaps
- Accessibility, responsiveness, and testing sign-offs from `PRD/10-definition-of-done.md` remain unmet.
- Storybook coverage called out in `PRD/12-storybook-checklist.md` is absent.

## Conclusion
Phase 1 is **not complete**. Only the global shell and high-level list pages exist; the majority of required screens, flows, and acceptance criteria are outstanding.
