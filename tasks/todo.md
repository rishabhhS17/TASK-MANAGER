# LockIn — Phase 1 Implementation

## Foundation
- [x] Install dependencies: firebase, zustand, dayjs
- [x] src/types/index.ts
- [x] src/lib/firebase.ts (lazy getters — SSR-safe)
- [x] src/lib/dayUtils.ts
- [x] src/lib/auth.ts
- [x] src/lib/firestore.ts
- [x] src/store/useAppStore.ts
- [x] src/hooks/useActiveDay.ts
- [x] src/app/globals.css (design tokens)
- [x] src/app/layout.tsx
- [x] src/components/AuthProvider/AuthProvider.tsx
- [x] firestore.rules
- [x] .env.local.example

## Auth
- [x] src/app/(auth)/login/page.tsx + CSS
- [x] src/app/(protected)/layout.tsx (auth guard + useActiveDay)

## Core — Today's View
- [x] src/app/(protected)/page.tsx
- [x] src/app/(protected)/page.module.css
- [x] src/components/Navbar/Navbar.tsx + CSS
- [x] src/components/PhaseTag/PhaseTag.tsx + CSS
- [x] src/components/TaskItem/TaskItem.tsx + CSS
- [x] src/components/AddTaskInput/AddTaskInput.tsx + CSS
- [x] src/components/LockButton/LockButton.tsx + CSS
- [x] src/components/ConfirmDialog/ConfirmDialog.tsx + CSS
- [x] src/components/CalendarWidget/CalendarWidget.tsx + CSS
- [x] src/components/LedgerModal/LedgerModal.tsx + CSS

## Backlog Store
- [x] src/app/(protected)/backlog/page.tsx + CSS
- [x] src/components/BacklogItem/BacklogItem.tsx + CSS

## Firestore
- [x] firestore.rules
- [ ] Deploy rules to Firebase (user action)

## Review
- Build: ✓ passes clean
- TypeScript: ✓ no errors
- Pending: Firebase project setup + .env.local from user

---

# LockIn — Phase 3 Implementation

## Security Hardening
- [x] firestore.rules — removed {document=**} wildcard that bypassed lock enforcement; replaced with per-collection explicit rules (days/backlog/recurring)

## Bug Fixes
- [x] src/lib/firestore.ts — getActiveDayIds now filters to locked/expired days only (calendar no longer highlights the current unlocked day)

## UX Polish
- [x] src/components/AddTaskInput/AddTaskInput.tsx — added optional `placeholder` prop (defaults to "Add a task…")
- [x] src/app/(protected)/recurring/page.tsx — recurring page uses "Add a routine…" placeholder

## Review
- Build: ✓ passes clean
- TypeScript: ✓ no errors

---

# LockIn — Phase 2 Implementation

## Recurring Tasks

- [x] src/types/index.ts — RecurringTask interface
- [x] src/lib/firestore.ts — getRecurringTasks, addRecurringTask, deleteRecurringTask, subscribeToRecurring
- [x] src/lib/firestore.ts — getOrCreateActiveDay seeds recurring tasks on fresh day creation
- [x] src/store/useAppStore.ts — recurringTasks + setRecurringTasks
- [x] src/components/RecurringItem/RecurringItem.tsx + CSS
- [x] src/app/(protected)/recurring/page.tsx + CSS
- [x] src/components/Navbar/Navbar.tsx — Recurring link added

## Review
- Build: ✓ passes clean
- TypeScript: ✓ no errors
- Routes: / · /backlog · /recurring · /login all generated
