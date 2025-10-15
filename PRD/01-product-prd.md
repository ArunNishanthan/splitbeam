# 01 — Product Requirements (PRD)

## Problem & Vision
SplitBeam helps people track shared expenses with friends and circles—manual currency conversion, clear history, recurring entries, and manual settle-ups—without payment integrations.

## Goals (v1)
- Fast UI for add, split, convert, review, and settle expenses.
- Manual currency conversion (per expense and circle-level base currency) with rate history.
- Clear Activity with audit for all changes.
- Recurring entries (future-only) with pause/skip.
- Manual settle-up (no payments).
- Invite by email only; friend must sign up before being added.
- Debt simplification per circle (auto after each change, toggle in circle settings).
- Mobile-first and dark mode. Every page has a hero section.

## Non-Goals
- Payments, exports, email/push notifications, rate limits, digests.

## Users & Roles
- **Member:** Full expense create/edit, conversions, recurring, settlements.
- **Circle Admin:** All of the above + can delete circle.
- **Friend:** Must sign up before appearing in an expense.

## Scope
- Auth: email+password and social (Google/Microsoft/Apple).
- Friend search: full email match only; other typeaheads suggest friend emails and circle names.
- Circles: admin delete; members can perform all other actions. Leaving/removal retains history.
- Base currency changes: do not alter old expenses by default; optional batch conversion of historical expenses with manual rate.
- Split methods: equal, shares, percentages, exact amounts.
- Hard delete with Activity audit entry.
- Attachments: image/PDF receipts.
- Comments: inline (no live chat).
- Activity: expense add/edit/delete, conversion, recurring add/edit/pause/skip, member join/leave, settlement, circle deleted.
- Simplification: per-circle toggle; auto after each change; no preview.
- Recurring: future-only; pause/skip; edits future only; past instance edits do not affect future.
- Currencies: top 30; symbol-first; follow currency decimals.
- Settlement: any currency with manual rate.

## Constraints
- WCAG 2.1 AA, FCP < 2.5s mid-tier mobile, last two major browsers.
