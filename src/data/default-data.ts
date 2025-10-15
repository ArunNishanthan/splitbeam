import type {
  Activity,
  Circle,
  Expense,
  Friend,
  MockState,
  RecurringRule,
  Settlement,
  User,
} from "@/types/entities";

const currentUser: User = {
  id: "user_1",
  email: "casey@splitbeam.app",
  name: "Casey Diaz",
  created_at: "2024-01-05T09:12:00.000Z",
};

const friends: Friend[] = [
  {
    id: "friend_1",
    email: "jules@studio.dev",
    status: "active",
    invited_at: "2024-01-18T14:20:00.000Z",
  },
  {
    id: "friend_2",
    email: "andrea@vault.io",
    status: "invited",
    invited_at: "2024-02-02T17:00:00.000Z",
  },
  {
    id: "friend_3",
    email: "nina@folio.co",
    status: "active",
    invited_at: "2024-02-10T11:45:00.000Z",
  },
];

const circles: Circle[] = [
  {
    id: "circle_1",
    name: "Lisbon Landing Crew",
    base_currency: "EUR",
    simplify_on: true,
    admin_user_id: currentUser.id,
    created_at: "2024-03-01T10:00:00.000Z",
  },
  {
    id: "circle_2",
    name: "NYC Studio Loft",
    base_currency: "USD",
    simplify_on: false,
    admin_user_id: currentUser.id,
    created_at: "2024-04-04T13:30:00.000Z",
  },
];

const expenses: Expense[] = [
  {
    id: "expense_1",
    scope: { type: "circle", id: "circle_1" },
    title: "Surfboard rentals",
    amount_base: 180.45,
    currency_base: "EUR",
    payers: [
      { user_id: currentUser.id, amount: 120.3 },
      { user_id: "friend_1", amount: 60.15 },
    ],
    split: { method: "equal" },
    created_by: currentUser.id,
    created_at: "2024-03-02T15:22:00.000Z",
    notes: "Weekend session at Guincho",
  },
  {
    id: "expense_2",
    scope: { type: "circle", id: "circle_1" },
    title: "Shared groceries",
    amount_base: 96.8,
    currency_base: "EUR",
    payers: [{ user_id: "friend_3" }],
    split: {
      method: "shares",
      shares: { [currentUser.id]: 2, friend_1: 1, friend_3: 1 } as Record<string, number>,
    },
    created_by: "friend_3",
    created_at: "2024-03-08T18:05:00.000Z",
  },
  {
    id: "expense_3",
    scope: { type: "circle", id: "circle_2" },
    title: "Studio cleaning service",
    amount_base: 210,
    currency_base: "USD",
    payers: [{ user_id: currentUser.id }],
    split: { method: "equal" },
    created_by: currentUser.id,
    created_at: "2024-04-10T09:00:00.000Z",
  },
];

const recurring: RecurringRule[] = [
  {
    id: "recurring_1",
    scope: { type: "circle", id: "circle_2" },
    template_expense: {
      scope: { type: "circle", id: "circle_2" },
      title: "Loft rent",
      amount_base: 3200,
      currency_base: "USD",
      payers: [{ user_id: currentUser.id }],
      split: { method: "equal" },
      created_by: currentUser.id,
      notes: "Due on the 1st",
      attachments: [],
    },
    cadence: "monthly",
    next_run: "2024-05-01T12:00:00.000Z",
    status: "active",
    created_by: currentUser.id,
    created_at: "2024-04-05T10:00:00.000Z",
  },
];

const settlements: Settlement[] = [
  {
    id: "settlement_1",
    scope: { type: "circle", id: "circle_1" },
    from_user: "friend_1",
    to_user: currentUser.id,
    amount: 45.2,
    currency: "EUR",
    created_at: "2024-03-12T19:40:00.000Z",
  },
];

const activity: Activity[] = [
  {
    id: "activity_1",
    type: "expense_add",
    scope: { type: "circle", id: "circle_1" },
    message: "Casey added Surfboard rentals to Lisbon Landing Crew",
    actor_user_id: currentUser.id,
    created_at: "2024-03-02T15:22:30.000Z",
    tags: ["expense", "lisbon landing crew"],
  },
  {
    id: "activity_2",
    type: "expense_add",
    scope: { type: "circle", id: "circle_1" },
    message: "Nina logged Shared groceries",
    actor_user_id: "friend_3",
    created_at: "2024-03-08T18:05:30.000Z",
    tags: ["expense", "shares"],
  },
  {
    id: "activity_3",
    type: "settlement",
    scope: { type: "circle", id: "circle_1" },
    message: "Jules settled €45.20 with Casey",
    actor_user_id: "friend_1",
    created_at: "2024-03-12T19:42:00.000Z",
    tags: ["settlement", "lisbon landing crew"],
  },
  {
    id: "activity_4",
    type: "expense_add",
    scope: { type: "circle", id: "circle_2" },
    message: "Casey added Studio cleaning service",
    actor_user_id: currentUser.id,
    created_at: "2024-04-10T09:05:00.000Z",
    tags: ["expense", "nyc studio loft"],
  },
];

export const defaultMockState: MockState = {
  currentUser,
  friends,
  circles,
  expenses,
  recurring,
  settlements,
  activity,
  profiles: [
    {
      user_id: currentUser.id,
      preferred_currency: "EUR",
      bio: "Product lead piloting SplitBeam's mock launch.",
      social_links: [
        { label: "Website", url: "https://splitbeam.app" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/casey-diaz" },
      ],
    },
  ],
};

export type MockStorageShape = typeof defaultMockState;
