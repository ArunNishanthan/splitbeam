# 11 — Risks & Mitigations

## Currency precision
Use high-precision numeric or store minor units per currency. Format via `Intl.NumberFormat`.

## Conversion integrity
Persist `rate_text` at creation; never overwrite unless the user changes it explicitly.

## Recurring scheduling
Normalize to UTC for date math; avoid DST drift.

## Access control
RLS policies per scope; author + admin writes; audit via Activity.

## Performance
Pagination for heavy lists; prefetch likely routes; memoize balances.
