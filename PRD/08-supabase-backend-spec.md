# 08 — Supabase Backend Spec (Not in UI Task List)

## Tables
- `profiles` (id UUID PK = auth.uid, email, name, created_at)
- `friends` (id UUID PK, owner_user_id FK -> profiles, friend_user_id FK -> profiles, status ENUM['active','invited'], created_at)
- `circles` (id UUID PK, name, base_currency text, simplify_on bool, admin_user_id FK -> profiles, created_at, deleted_at nullable)
- `circle_members` (circle_id FK, user_id FK, role ENUM['admin','member'], joined_at, PK (circle_id,user_id))
- `expenses` (id UUID PK, scope_type ENUM['circle','friend'], scope_id UUID, title text, amount_base numeric(18,6), currency_base text, created_by FK, created_at, updated_at, deleted_at)
- `expense_splitters` (expense_id FK, user_id FK, method ENUM['equal','shares','percent','exact'], share numeric, percent numeric, exact_amount numeric)
- `expense_payers` (expense_id FK, user_id FK, amount numeric(18,6))
- `expense_conversions` (id UUID PK, expense_id FK, target_currency text, rate_text text, amount_converted numeric(18,6), created_at)
- `attachments` (id UUID PK, expense_id FK, url text, mime text, created_at)
- `recurring_rules` (id UUID PK, scope_type, scope_id, cadence, custom_cron, next_run date, status ENUM['active','paused'], template JSONB, created_by FK, created_at, updated_at)
- `settlements` (id UUID PK, scope_type, scope_id, from_user FK, to_user FK, amount numeric(18,6), currency text, rate_text text, created_at)
- `activity` (id UUID PK, type text, scope_type, scope_id, message text, actor_user_id FK, created_at)

## Views
- `v_circle_balances`, `v_friend_balances` aggregate payers/splits/settlements.

## Storage
- Bucket `receipts` (private). Signed URLs for display.

## RLS (high level)
- Circle members read; admin updates/deletes circles.
- Expenses & related rows: scope members read; author/admin write/delete.
- Recurring rules: members read; author/admin write.
- Activity: read for members of the scope.

## Functions/Triggers
- `fn_log_activity` AFTER INSERT/UPDATE/DELETE: expenses, conversions, recurring, settlements, circles (delete).
- `fn_generate_recurring` scheduled job.
- `fn_simplify_debt(circle_id)` recomputes net transfers when enabled.

## Indexes
- `(scope_type, scope_id)` for expenses, conversions, activity.
- GIN on `template` in `recurring_rules`.
