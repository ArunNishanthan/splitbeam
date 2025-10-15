"use client";

import * as React from "react";

import { createId } from "@/lib/id";
import {
  type Activity,
  type ActivityFilters,
  type Circle,
  type CircleCreateInput,
  type CircleSettingsPatch,
  type DataProvider,
  type Expense,
  type ExpenseCreateInput,
  type ExpenseListScope,
  type ExpensePatch,
  type Friend,
  type MockState,
  type RecurringCreateInput,
  type RecurringPatch,
  type RecurringRule,
  type Settlement,
  type SettlementCreateInput,
  type User,
} from "@/types/entities";

import { defaultMockState } from "./default-data";

const STORAGE_KEY = "splitbeam.mock-state.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidState(value: unknown): value is MockState {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.friends) &&
    Array.isArray(value.circles) &&
    Array.isArray(value.expenses) &&
    Array.isArray(value.activity)
  );
}

const DataProviderContext = React.createContext<DataProvider | null>(null);
const DataStateContext = React.createContext<MockState>(defaultMockState);

function persistState(state: MockState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState(): MockState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isValidState(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse mock state", error);
  }
  return null;
}

function filterExpenses(expenses: Expense[], scope?: ExpenseListScope) {
  if (!scope) return expenses;
  return expenses.filter((expense) => expense.scope.type === scope.type && expense.scope.id === scope.id);
}

function filterActivity(activity: Activity[], filters?: ActivityFilters) {
  if (!filters?.scope) return activity;
  if (filters.scope.type === "global") {
    return activity.filter((item) => item.scope.type === "global");
  }
  return activity.filter(
    (item) => item.scope.type === filters.scope.type && item.scope.id === filters.scope.id,
  );
}

function upsertActivity(state: MockState, activity: Activity): MockState {
  return {
    ...state,
    activity: [activity, ...state.activity].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  };
}

function ensureCircle(state: MockState, id: string): Circle {
  const circle = state.circles.find((item) => item.id === id);
  if (!circle) {
    throw new Error(`Circle ${id} not found`);
  }
  return circle;
}

function ensureExpense(state: MockState, id: string): Expense {
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) {
    throw new Error(`Expense ${id} not found`);
  }
  return expense;
}

function ensureRecurring(state: MockState, id: string): RecurringRule {
  const rule = state.recurring.find((item) => item.id === id);
  if (!rule) {
    throw new Error(`Recurring rule ${id} not found`);
  }
  return rule;
}

export function DataProviderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<MockState>(defaultMockState);
  const hasLoadedRef = React.useRef(false);

  React.useEffect(() => {
    const restored = loadState();
    if (restored) {
      setState(restored);
    }
    hasLoadedRef.current = true;
  }, []);

  React.useEffect(() => {
    if (!hasLoadedRef.current) return;
    persistState(state);
  }, [state]);

  const provider = React.useMemo<DataProvider>(() => ({
    auth: {
      async signInEmail(email: string, password: string) {
        console.info("mock: signInEmail", email, password ? "***" : "");
        return state.currentUser;
      },
      async signInSocial(providerName: string) {
        console.info("mock: signInSocial", providerName);
        return state.currentUser;
      },
      async signOut() {
        console.info("mock: signOut");
      },
      async currentUser() {
        return state.currentUser;
      },
    },
    friends: {
      async searchByEmail(email: string) {
        return state.friends.find((friend) => friend.email === email);
      },
      async invite(email: string) {
        const friend: Friend = {
          id: createId("friend"),
          email,
          status: "invited",
          invited_at: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, friends: [...prev.friends, friend] }));
        return friend;
      },
      async list() {
        return state.friends;
      },
    },
    circles: {
      async list() {
        return state.circles;
      },
      async get(id: string) {
        return ensureCircle(state, id);
      },
      async create(input: CircleCreateInput) {
        const now = new Date().toISOString();
        const circle: Circle = {
          id: createId("circle"),
          name: input.name,
          base_currency: input.base_currency,
          simplify_on: input.simplify_on,
          admin_user_id: state.currentUser.id,
          created_at: now,
        };
        const activity: Activity = {
          id: createId("activity"),
          type: "member_join",
          scope: { type: "circle", id: circle.id },
          message: `${state.currentUser.name ?? "You"} created ${circle.name}`,
          actor_user_id: state.currentUser.id,
          created_at: now,
        };
        setState((prev) => upsertActivity({ ...prev, circles: [...prev.circles, circle] }, activity));
        return circle;
      },
      async updateSettings(id: string, patch: CircleSettingsPatch) {
        let updatedCircle: Circle | null = null;
        setState((prev) => {
          const nextCircles = prev.circles.map((circle) => {
            if (circle.id !== id) return circle;
            updatedCircle = { ...circle, ...patch } satisfies Circle;
            return updatedCircle;
          });
          return { ...prev, circles: nextCircles };
        });
        if (!updatedCircle) {
          throw new Error(`Circle ${id} not found`);
        }
        return updatedCircle;
      },
      async delete(id: string) {
        const circle = ensureCircle(state, id);
        const now = new Date().toISOString();
        const activity: Activity = {
          id: createId("activity"),
          type: "circle_delete",
          scope: { type: "circle", id },
          message: `${circle.name} was archived`,
          actor_user_id: state.currentUser.id,
          created_at: now,
        };
        setState((prev) =>
          upsertActivity(
            {
              ...prev,
              circles: prev.circles.filter((item) => item.id !== id),
            },
            activity,
          ),
        );
      },
    },
    expenses: {
      async list(scope?: ExpenseListScope) {
        return filterExpenses(state.expenses, scope);
      },
      async create(input: ExpenseCreateInput) {
        const expense: Expense = {
          ...input,
          id: createId("expense"),
          created_at: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, expenses: [expense, ...prev.expenses] }));
        return expense;
      },
      async update(id: string, patch: ExpensePatch) {
        let nextExpense: Expense | null = null;
        setState((prev) => {
          const nextExpenses = prev.expenses.map((expense) => {
            if (expense.id !== id) return expense;
            nextExpense = { ...expense, ...patch } satisfies Expense;
            return nextExpense;
          });
          if (!nextExpense) {
            throw new Error(`Expense ${id} not found`);
          }
          return { ...prev, expenses: nextExpenses };
        });
        if (!nextExpense) {
          throw new Error(`Expense ${id} not found`);
        }
        return nextExpense;
      },
      async delete(id: string) {
        ensureExpense(state, id);
        setState((prev) => ({
          ...prev,
          expenses: prev.expenses.filter((expense) => expense.id !== id),
        }));
      },
    },
    conversions: {
      async create(expenseId, target_currency, rate_text, amount_converted) {
        setState((prev) => ({
          ...prev,
          expenses: prev.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                  ...expense,
                  conversion: { target_currency, rate_text, amount_converted },
                }
              : expense,
          ),
        }));
      },
    },
    recurring: {
      async list(scope?: ExpenseListScope) {
        if (!scope) return state.recurring;
        return state.recurring.filter((rule) => rule.scope.type === scope.type && rule.scope.id === scope.id);
      },
      async create(input: RecurringCreateInput) {
        const rule: RecurringRule = {
          ...input,
          id: createId("recurring"),
          created_at: new Date().toISOString(),
        };
        setState((prev) => ({ ...prev, recurring: [...prev.recurring, rule] }));
        return rule;
      },
      async update(id: string, patch: RecurringPatch) {
        let nextRule: RecurringRule | null = null;
        setState((prev) => {
          const nextRecurring = prev.recurring.map((rule) => {
            if (rule.id !== id) return rule;
            nextRule = { ...rule, ...patch } satisfies RecurringRule;
            return nextRule;
          });
          if (!nextRule) {
            throw new Error(`Recurring rule ${id} not found`);
          }
          return { ...prev, recurring: nextRecurring };
        });
        if (!nextRule) {
          throw new Error(`Recurring rule ${id} not found`);
        }
        return nextRule;
      },
      async pause(id: string) {
        ensureRecurring(state, id);
        setState((prev) => ({
          ...prev,
          recurring: prev.recurring.map((rule) =>
            rule.id === id ? { ...rule, status: "paused" } : rule,
          ),
        }));
      },
      async resume(id: string) {
        ensureRecurring(state, id);
        setState((prev) => ({
          ...prev,
          recurring: prev.recurring.map((rule) =>
            rule.id === id ? { ...rule, status: "active" } : rule,
          ),
        }));
      },
      async skipNext(id: string) {
        const rule = ensureRecurring(state, id);
        const nextRun = new Date(rule.next_run);
        nextRun.setMonth(nextRun.getMonth() + 1);
        setState((prev) => ({
          ...prev,
          recurring: prev.recurring.map((item) =>
            item.id === id ? { ...item, next_run: nextRun.toISOString() } : item,
          ),
        }));
      },
    },
    settlements: {
      async create(input: SettlementCreateInput) {
        const settlement: Settlement = {
          ...input,
          id: createId("settlement"),
          created_at: new Date().toISOString(),
        };
        const activity: Activity = {
          id: createId("activity"),
          type: "settlement",
          scope: { type: settlement.scope.type, id: settlement.scope.id },
          message: `Settlement recorded for ${settlement.amount} ${settlement.currency}`,
          actor_user_id: settlement.from_user,
          created_at: settlement.created_at,
        };
        setState((prev) =>
          upsertActivity(
            {
              ...prev,
              settlements: [...prev.settlements, settlement],
            },
            activity,
          ),
        );
        return settlement;
      },
    },
    activity: {
      async list(filters?: ActivityFilters) {
        return filterActivity(state.activity, filters);
      },
    },
  }), [state]);

  return (
    <DataProviderContext.Provider value={provider}>
      <DataStateContext.Provider value={state}>{children}</DataStateContext.Provider>
    </DataProviderContext.Provider>
  );
}

export function useDataProvider() {
  const ctx = React.useContext(DataProviderContext);
  if (!ctx) {
    throw new Error("useDataProvider must be used within DataProviderProvider");
  }
  return ctx;
}

export function useMockState() {
  return React.useContext(DataStateContext);
}
