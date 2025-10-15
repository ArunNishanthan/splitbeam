# 13 — Auth & Account Flows (SplitBeam)

All auth screens include a **hero** with headline, supportive text, and primary CTA. Dark mode supported. Rich icons only (no emojis).

## 1) Screens

### 1.1 Login
- **Hero:** “Welcome to SplitBeam” — “Track shared expenses across friends and circles.”
- **Fields:** Email, Password
- **Actions:** Sign in (primary), Continue with Google/Microsoft/Apple, Forgot password, Create account
- **Validation:** Email format; password non-empty
- **Errors:** Invalid credentials; locked account; provider error
- **A11y:** Labels + `aria-describedby` for errors; focus ring on tab order; Enter submits
- **States:** loading, error, disabled when submitting

### 1.2 Sign Up
- **Hero:** “Create your SplitBeam account” — “Invite friends by email and split seamlessly.”
- **Fields:** Email, Password, Confirm password, Name (optional)
- **Actions:** Create account (primary), Continue with Google/Microsoft/Apple, Sign in
- **Validation:** Email; password strength (min length, mixed chars); confirm match
- **Post-create:** If arriving from invite, link to inviter and mark friend as active
- **Email verification:** Optional in v1 (if enabled later, show “Check your email” state)

### 1.3 Forgot Password
- **Hero:** “Reset your password” — “We’ll send a secure link to your email.”
- **Field:** Email
- **Actions:** Send reset link (primary), Back to sign in
- **States:** success (non-enumerative message), error

### 1.4 Social Sign-in
- **Hero:** “Continue with your account” — “We support Google, Microsoft, and Apple.”
- **Buttons:** Google / Microsoft / Apple (provider buttons with icon + brand color border)
- **Linking:** If email exists from password signup, prompt to link providers
- **Errors:** Provider canceled, mismatched email, popup blocked

### 1.5 Email Invite Landing
- **Hero:** “You’ve been invited to SplitBeam” — “Finish signup to join your friend’s circle.”
- **Content:** Show inviter email; call-to-action to create account
- **Edge:** If already signed in, accept invite and continue

## 2) Interactions & Edge Cases
- **Pending friend constraint:** A friend must sign up before appearing in expenses. If user tries to add non-registered friend, show inline block with one-click invite.
- **Rate limit:** None in v1; guard UI with debounce on buttons and idempotent actions.
- **Account lock:** After multiple failed attempts, show neutral message (no enumeration).

## 3) Acceptance Criteria
- Keyboard-only login works; Enter on password submits
- Clear error messages tied to inputs via `aria-describedby`
- Social providers complete happy path; canceled/failed states surface inline errors
- Coming from invite deep link: email is prefilled and immutable for that flow
- Dark mode parity and contrast AA

## 4) Data Contracts (UI ↔ DataProvider)

```ts
type Provider = 'google'|'microsoft'|'apple';

interface AuthAPI {
  signInEmail(email:string, password:string): Promise<User>;
  signInSocial(provider:Provider): Promise<User>;
  signUpEmail(email:string, password:string, name?:string, inviteToken?:string): Promise<User>;
  requestPasswordReset(email:string): Promise<void>;
  resetPassword(token:string, newPassword:string): Promise<void>;
  linkProvider(provider:Provider): Promise<void>;
  signOut(): Promise<void>;
}
```

- **Errors:** `{ code: 'INVALID_CREDENTIALS'|'PROVIDER_ERROR'|'ACCOUNT_LOCKED'|'TOKEN_EXPIRED'|'RATE_LIMITED', message: string }`

## 5) UI Components
- **Input.Email** with validation feedback and auto-complete
- **Input.Password** with show/hide toggle (no strength meter exposed in v1)
- **Button.Provider**: icon + label, brand-compliant border and hover
- **Alert**: error surface for global errors; inline field errors for validation

## 6) Navigation & Redirects
- After login -> Last attempted route or Home
- After signup via invite -> Accept invite -> Home (or target circle)
- After password reset -> Sign in with success toast/banner

## 7) Security Notes (UI-level)
- Prevent email enumeration in messages
- Disable buttons while submitting
- Use `autocomplete="email"` and `autocomplete="current-password"` appropriately
