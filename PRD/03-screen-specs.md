# 03 — Screen Specs (SplitBeam)

All screens include a hero section.

## Home
Hero: Split, convert, and settle — without the noise. CTAs: Add Expense, Browse Circles.
- KPIs: You Owe / You Are Owed (tiles)
- Recent Activity with filters
- Quick Actions: Add Friend, New Circle, Add Expense, Recurring

## Circles (Index)
Hero: Track shared balances by circle. CTA: New Circle.
- Cards: icon, base currency, balance, last activity

## Circle Detail
Hero: Circle name; actions: Add Expense, Settings.
- Meta badges: base currency, simplify toggle state
- KPI: Net Balance tile
- Members: list (add by email; full email)
- Expenses table: [Title, Amount (base), Converted, Rate, Notes]
- Activity: scoped to circle

## Friends (Index)
Hero: Track one-to-one balances. CTA: Invite Friend.
- Cards: avatar initial, email, net balance (symbol-first, negative leading minus)

## Activity
Hero: What’s changed.
- Feed: tag chip + description + time; in-app indicator reset on view

## Add Expense
Hero: Add expense. Actions: Save, Cancel.
- Where: typeahead (circles/friends). New friend blocked until signup.
- What: title, category.
- Amount & Currency: numeric + currency.
- Payers: existing friends; multi.
- Split: equal/shares/percent/exact.
- Manual Conversion: toggle -> target currency + rate string + converted amount.
- Recurring: future-only toggle; cadence; start rule.
- Notes.

Validation: Where required, amount > 0, currency required, split reconciles, conversion requires target+rate.

## Expense Detail
- Tiles: amount (base), converted, rate used
- Comments: list + input
- Attachments: image/PDF upload
- Actions: Edit, Delete (hard)

## Recurring
Hero: Automate future expenses.
- Rule tiles: name, cadence, next run
- Actions: New Rule, Edit, Pause/Resume, Skip next

## Reports (Stub)
Hero: Understand trends.
- Filters (date range, scope); placeholder visuals

## Settings
- Profile: name; preferred currency; theme
- Security: password; link/unlink social
- Notifications: in-app Activity indicator only
- Circle Settings (from Circle): base currency change (optional historical conversion with manual rate); simplify toggle
