# SplitBeam — PRD Bundle

This repository contains the complete specification for SplitBeam v1. It is designed so the UI can be implemented first with mocked services and later switched to the real Supabase backend via a feature flag.

## Files
- 13-auth-spec.md — Login/Sign-up/Reset flows and contracts
- 00-design-system.md — Tokens (hex), components, dark mode, iconography
- 01-product-prd.md — Core product requirements
- 02-design-spec.md — Design system, colors, components, dark mode
- 03-screen-specs.md — Per-screen specs with content, CTAs, states, validations
- 04-ux-flows.md — End-to-end flows with acceptance criteria
- 05-frontend-plan.md — Tech stack, service adapters, feature flags
- 06-task-list.md — Epics, tasks, deliverables, AC, testing, DoD
- 07-data-contracts.md — Types and contracts used by mock and backend
- 08-supabase-backend-spec.md — DB schema, RLS, functions (not in task list)
- 09-analytics.md — Metrics and instrumentation
- 10-definition-of-done.md — Global DoD
- 11-risks-mitigations.md — Known risks and mitigation strategies
- 12-storybook-checklist.md — Component states to document and test

## Build Approach
- **Phase 1 (UI-first):** Implement all screens and logic using a `DataProvider` in `mock` mode with local persistence.
- **Phase 2 (Backend):** Implement the Supabase spec and flip `DATA_MODE` to `remote`.
