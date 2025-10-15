# 04 — UX Flows & Acceptance Criteria

## Invite & Add Friend
- Enter full email -> if not registered, inline: “Invite sent. They must sign up before you can add expenses.”
- Save blocked until friend is active.
- Activity logs when member joins.

## Add Expense with Conversion
- Base amount/currency -> split -> toggle Manual Conversion -> target currency + rate -> converted total shown
- Save: Activity shows expense add + conversion with rate string
- Both base and converted appear on expense and in Activity.

## Change Circle Base Currency
- Choose new base; prompt “Apply to old expenses?”
- If Yes: require manual batch rate; record Activity conversion
- If No: only new expenses use new base.

## Recurring
- Create rule future-only; first run ≥ next boundary
- Pause/Resume/Skip; Activity logs
- Editing past instance never changes future.

## Manual Settle Up
- Settlement in any currency with optional rate text
- Activity and balances update

## Debt Simplification
- Per-circle toggle; auto after each change; no preview
- Activity: “debts simplified” summary line
