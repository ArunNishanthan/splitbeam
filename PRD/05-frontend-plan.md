# 05 — Frontend Plan (UI-first, Mocked)

## Tech
React + Vite/Next, Tailwind + shadcn/ui, Lucide icons, Zustand/RTK, React Query façade, React Router/Next app router, CSS variables for theming, Intl for currency, client mock uploads.

## Feature Flag
```ts
type DataMode = 'mock' | 'remote';
export const DATA_MODE: DataMode = 'mock';
```

## DataProvider Interface
```ts
interface DataProvider {
  auth: { signInEmail(e,p):Promise<User>; signInSocial(provider):Promise<User>; signOut():Promise<void>; };
  friends: { searchByEmail(email:string):Promise<Friend|undefined>; invite(email:string):Promise<void>; list():Promise<Friend[]>; };
  circles: { list():Promise<Circle[]>; get(id:string):Promise<Circle>; create(input):Promise<Circle>; updateSettings(id,patch):Promise<Circle>; delete(id:string):Promise<void>; };
  expenses: { list(scope):Promise<Expense[]>; create(input):Promise<Expense>; update(id,patch):Promise<Expense>; delete(id:string):Promise<void>; };
  conversions: { create(expenseId:string, target_currency:string, rate_text:string, amount_converted:number):Promise<void>; };
  recurring: { list(scope?):Promise<RecurringRule[]>; create(input):Promise<RecurringRule>; update(id,patch):Promise<RecurringRule>; pause(id):Promise<void>; resume(id):Promise<void>; skipNext(id):Promise<void>; };
  settlements: { create(input):Promise<Settlement>; };
  activity: { list(filters):Promise<Activity[]>; };
}
```

## Mock Storage
In-memory + `localStorage` persistence keys: `circles`, `friends`, `expenses`, `recurring`, `activity`, `settlements`, `profiles`.
