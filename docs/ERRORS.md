# Phase 1 Build Errors & Resolutions

A record of every non-trivial problem hit during Phase 1 implementation, in the order they appeared.

---

## 1. Firebase `auth/invalid-api-key` during `next build`

**Symptom**
`next build` failed with `auth/invalid-api-key` even though `.env.local` was correct. The error appeared at compile time, not at runtime.

**Root cause**
The original `firebase.ts` exported `auth` and `db` as module-level constants:
```ts
export const auth = getAuth(app)   // ← runs at module import time
export const db   = getFirestore(app)
```
Next.js 16 statically pre-renders pages during build. When the server-side renderer imported any file that transitively imported `firebase.ts`, `initializeApp` ran on the server where `NEXT_PUBLIC_*` env vars are empty strings, causing Firebase to reject the API key.

**What didn't work**
Wrapping the login page with `dynamic({ ssr: false })` in the root layout — Next.js 16 rejects `ssr: false` on Server Components with a hard error.

**Fix**
Replaced module-level exports with lazy getter functions:
```ts
let _auth: Auth | null = null
export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp())
  return _auth
}
```
`initializeApp` is now only called the first time a getter is invoked, which only happens inside `useEffect` / event handlers (client-side). All consumers were updated to call `getFirebaseAuth()` / `getFirebaseDb()` instead of importing the value directly.

---

## 2. Stale `.next/types/validator.ts` TypeScript error

**Symptom**
After deleting an old `page.tsx` and replacing it with a new file, `tsc --noEmit` reported a type error inside `.next/types/validator.ts` pointing at the deleted file's expected export shape.

**Root cause**
Next.js generates `.next/types/` during the previous build run. Those generated types don't update until the next `next build` / `next dev` startup. Deleting source files leaves stale generated type stubs behind.

**Fix**
Delete `.next/` before running the type-check:
```bash
rm -rf .next && npx tsc --noEmit
```

---

## 3. Firebase project creation failures

**Symptom**
Two successive attempts to create a Firebase project via CLI (`lockin-app`) failed:
- First attempt: project ID already claimed by another Google account.
- Second attempt: Terms of Service had not been accepted for the billing account, blocking project creation entirely.

**Fix**
User created the project manually in the Firebase Console (`task-manager-5d1eb`). The project ID was then supplied and wired into `.env.local`.

---

## 4. Firestore `permission-denied` error on sign-out

**Symptom**
After clicking Sign Out, the browser console logged:
```
@firebase/firestore: Uncaught Error in snapshot listener:
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```
The Next.js dev overlay also showed "1 Issue".

**Root cause**
The `onSnapshot` listeners (`subscribeToDay`, `subscribeToBacklog`) had no error handler. When Firebase Auth revoked the session, Firestore immediately fired the listener's error callback. Because no error handler was registered, the error propagated to the console as uncaught.

The listeners were cleaned up a moment later when the components unmounted (auth guard redirects to `/login`), but the error had already fired.

**Fix**
Added a silent error handler to each `onSnapshot` call:
```ts
return onSnapshot(
  ref,
  (snap) => { /* handle data */ },
  () => { /* permission revoked on sign-out — component will unmount shortly */ }
)
```

---

## 5. Playwright `fill()` bypassing React controlled input state

**Symptom**
During Playwright verification, using `browser_type` with `fill()` (Playwright's fast fill) cleared the input visually but the task was never added. The form submitted with an empty string.

**Root cause**
React controlled inputs store their value in component state (`useState`). Playwright's `fill()` sets the DOM value directly without dispatching `input` / `change` events, so React's `onChange` never fires and the state variable stays `''`. When the form submits, it reads the stale state, not the DOM value.

**Fix**
Used `browser_type` with `slowly: true`, which calls `pressSequentially()` — typing one character at a time so each keystroke fires a real `input` event that React's synthetic event system picks up.

---

## 6. COOP warnings from Firebase Auth popup (Playwright only)

**Symptom**
Eight repeated console errors during Playwright runs:
```
Cross-Origin-Opener-Policy policy would block the window.closed call.
```

**Root cause**
Playwright sets strict `Cross-Origin-Opener-Policy` headers. Firebase Auth's popup sign-in flow polls `window.closed` on the popup window, which COOP blocks. This is a known incompatibility between Playwright's browser context and Firebase's popup OAuth flow.

**Impact**
None for real users — standard browser sessions don't apply COOP restrictions the same way. The Google SSO button works correctly in a normal browser. This warning only appears in Playwright's automated context and can be ignored.
