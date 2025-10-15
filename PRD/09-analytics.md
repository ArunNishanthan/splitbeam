# 09 — Analytics

## Metrics
- Page views: route name.
- Key actions: add expense, conversion added, recurring created/paused/skipped, base currency changed, settlement created.
- Performance: time-to-interact on Add Expense.

## Implementation
- Lightweight analytics adapter with event queue; mock emitter in `mock` mode; real emitter later.
