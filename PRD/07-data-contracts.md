# 07 — Data Contracts

```ts
type CurrencyCode = 'USD'|'EUR'|'GBP'|'INR'|'JPY'|'SGD'|'AUD'|'CAD'|string;

type User = { id: string; email: string; name?: string; created_at: string; };

type Friend = { id: string; email: string; status: 'active'|'invited'; };

type Circle = {
  id: string;
  name: string;
  base_currency: CurrencyCode;
  simplify_on: boolean;
  admin_user_id: string;
  created_at: string;
  deleted_at?: string | null;
};

type Expense = {
  id: string;
  scope: { type: 'circle'|'friend'; id: string; };
  title: string;
  amount_base: number;
  currency_base: CurrencyCode;
  payers: { user_id: string; amount?: number }[];
  split: { method: 'equal'|'shares'|'percent'|'exact'; shares?: Record<string, number>; };
  conversion?: { target_currency: CurrencyCode; rate_text: string; amount_converted: number };
  notes?: string;
  attachments?: Attachment[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

type Attachment = { id: string; expense_id: string; url: string; mime: 'image/*'|'application/pdf'; };

type RecurringRule = {
  id: string;
  scope: { type: 'circle'|'friend'; id: string; };
  template_expense: Omit<Expense,'id'|'created_at'|'updated_at'|'deleted_at'>;
  cadence: 'weekly'|'monthly'|'custom';
  custom_cron?: string;
  next_run: string;
  status: 'active'|'paused';
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

type Settlement = {
  id: string;
  scope: { type: 'circle'|'friend'; id: string; };
  from_user: string;
  to_user: string;
  amount: number;
  currency: CurrencyCode;
  rate_text?: string;
  created_at: string;
};

type Activity = {
  id: string;
  type: 'expense_add'|'expense_edit'|'expense_delete'|'conversion'|'recurring_add'|'recurring_edit'|'recurring_pause'|'recurring_skip'|'member_join'|'member_leave'|'settlement'|'circle_delete';
  scope: { type: 'global'|'circle'|'friend'; id?: string };
  message: string;
  actor_user_id: string;
  created_at: string;
};
```
