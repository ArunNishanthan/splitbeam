export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "JPY"
  | "SGD"
  | "AUD"
  | "CAD"
  | (string & {});

export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

export type Friend = {
  id: string;
  email: string;
  status: "active" | "invited";
  invited_at?: string;
};

export type Circle = {
  id: string;
  name: string;
  base_currency: CurrencyCode;
  simplify_on: boolean;
  admin_user_id: string;
  created_at: string;
  deleted_at?: string | null;
};

export type Expense = {
  id: string;
  scope: { type: "circle" | "friend"; id: string };
  title: string;
  amount_base: number;
  currency_base: CurrencyCode;
  payers: { user_id: string; amount?: number }[];
  split: {
    method: "equal" | "shares" | "percent" | "exact";
    shares?: Record<string, number>;
  };
  conversion?: {
    target_currency: CurrencyCode;
    rate_text: string;
    amount_converted: number;
  };
  notes?: string;
  attachments?: Attachment[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Attachment = {
  id: string;
  expense_id: string;
  url: string;
  mime: "image/*" | "application/pdf" | (string & {});
};

export type RecurringRule = {
  id: string;
  scope: { type: "circle" | "friend"; id: string };
  template_expense: Omit<Expense, "id" | "created_at" | "updated_at" | "deleted_at">;
  cadence: "weekly" | "monthly" | "custom";
  custom_cron?: string;
  next_run: string;
  status: "active" | "paused";
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type Settlement = {
  id: string;
  scope: { type: "circle" | "friend"; id: string };
  from_user: string;
  to_user: string;
  amount: number;
  currency: CurrencyCode;
  rate_text?: string;
  created_at: string;
};

export type Activity = {
  id: string;
  type:
    | "expense_add"
    | "expense_edit"
    | "expense_delete"
    | "conversion"
    | "recurring_add"
    | "recurring_edit"
    | "recurring_pause"
    | "recurring_skip"
    | "member_join"
    | "member_leave"
    | "settlement"
    | "circle_delete";
  scope: { type: "global" | "circle" | "friend"; id?: string };
  message: string;
  actor_user_id: string;
  created_at: string;
  tags?: string[];
};

export type Profile = {
  user_id: string;
  preferred_currency: CurrencyCode;
  bio?: string;
  social_links?: { label: string; url: string }[];
};

export type MockState = {
  currentUser: User;
  friends: Friend[];
  circles: Circle[];
  expenses: Expense[];
  recurring: RecurringRule[];
  settlements: Settlement[];
  activity: Activity[];
  profiles: Profile[];
};

export type CircleCreateInput = {
  name: string;
  base_currency: CurrencyCode;
  simplify_on: boolean;
};

export type CircleSettingsPatch = Partial<{
  name: string;
  base_currency: CurrencyCode;
  simplify_on: boolean;
}>;

export type ExpenseCreateInput = Omit<
  Expense,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export type ExpensePatch = Partial<Omit<Expense, "id" | "created_at">>;

export type RecurringCreateInput = Omit<
  RecurringRule,
  "id" | "created_at" | "updated_at"
>;

export type RecurringPatch = Partial<Omit<RecurringRule, "id" | "created_at" | "scope" | "created_by" >>;

export type SettlementCreateInput = Omit<Settlement, "id" | "created_at">;

export type ActivityFilters = {
  scope?: { type: "global" | "circle" | "friend"; id?: string };
};

export type ExpenseListScope =
  | undefined
  | { type: "circle"; id: string }
  | { type: "friend"; id: string };

export interface DataProvider {
  auth: {
    signInEmail(email: string, password: string): Promise<User>;
    signInSocial(provider: string): Promise<User>;
    signOut(): Promise<void>;
    currentUser(): Promise<User>;
  };
  friends: {
    searchByEmail(email: string): Promise<Friend | undefined>;
    invite(email: string): Promise<Friend>;
    list(): Promise<Friend[]>;
  };
  circles: {
    list(): Promise<Circle[]>;
    get(id: string): Promise<Circle>;
    create(input: CircleCreateInput): Promise<Circle>;
    updateSettings(id: string, patch: CircleSettingsPatch): Promise<Circle>;
    delete(id: string): Promise<void>;
  };
  expenses: {
    list(scope?: ExpenseListScope): Promise<Expense[]>;
    create(input: ExpenseCreateInput): Promise<Expense>;
    update(id: string, patch: ExpensePatch): Promise<Expense>;
    delete(id: string): Promise<void>;
  };
  conversions: {
    create(
      expenseId: string,
      target_currency: CurrencyCode,
      rate_text: string,
      amount_converted: number,
    ): Promise<void>;
  };
  recurring: {
    list(scope?: ExpenseListScope): Promise<RecurringRule[]>;
    create(input: RecurringCreateInput): Promise<RecurringRule>;
    update(id: string, patch: RecurringPatch): Promise<RecurringRule>;
    pause(id: string): Promise<void>;
    resume(id: string): Promise<void>;
    skipNext(id: string): Promise<void>;
  };
  settlements: {
    create(input: SettlementCreateInput): Promise<Settlement>;
  };
  activity: {
    list(filters?: ActivityFilters): Promise<Activity[]>;
  };
}
