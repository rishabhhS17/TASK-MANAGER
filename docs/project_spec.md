# Project Spec — LockIn

## Overview

A minimalist, high-accountability daily task engine that operates as an unyielding state machine. Unlike standard todo apps that allow infinite mid-day shuffling, LockIn forces a psychological boundary between **planning your day** and **executing it**.

## Goals

- Enforce discipline through an irreversible lock mechanism — no edits once committed
- Create a rolling 24-hour cycle that resets automatically
- Archive uncompleted tasks into a visible backlog to build accountability
- Provide a read-only historical ledger so users can see their track record
- Support recurring task templates for daily routines

## Target Users

- Individuals who struggle with over-planning and under-executing
- Productivity-focused users who want a strict, no-excuse daily workflow
- Anyone tired of endlessly reshuffling todo lists

---

## Core Lifecycle — The Three Phases

### Phase 1: Planning (Unlocked)

- User logs in via Google
- Full edit rights: add new tasks, delete mistakes, pull items from Backlog Store
- Recurring Tasks are auto-injected as editable templates
- Ends when the user presses the **Lock Button**

### Phase 2: Execution (Locked)

- System saves the exact timestamp (`Tlock`) and sets expiration at `Tlock + 24 hours`
- Input fields and delete buttons are stripped from the UI
- Only interaction: clicking checkboxes to create permanent Ticks (✓)
- No task additions or modifications allowed (enforced both client-side and via Firestore rules)

### Phase 3: Expiration (Lazy Reset)

- Triggered the next time the user opens the app after the 24-hour window has passed
- Completed tasks → archived to history
- Uncompleted tasks → routed to the **Backlog Pool** with a Cross (✗)
- App resets to Phase 1 for a new cycle

---

## Key Feature Modules

### A. Minimalist Calendar Widget

A small dark-blue grid on the home page.

- **Active Days Only**: Days where the user locked and tracked tasks are highlighted. Days with no activity are greyed out and unclickable.
- **Ledger View**: Clicking an active past date opens a strict, read-only snapshot. Completed tasks show a solid Tick (✓), failed tasks show a solid Cross (✗).

### B. Backlog Store

A dedicated archive accessible from the navbar containing all uncompleted past tasks.

- **Contextual Hover**: Hovering over a backlog item reveals its original creation date — forcing the user to see how long they've been putting it off.
- **The Lock Gate**:
  - If today is **Unlocked**: hover reveals an "Add to Today" button. Clicking it adds the task to today's list as `Task Name (backlog of <date>)`.
  - If today is **Locked**: the "Add to Today" button is completely removed from the DOM — no injecting work into a locked execution phase.
- **Backlog Persistence**:
  - Adding a backlog item to today does **NOT** remove it from the Backlog Store. It stays there until it is actually completed (checked off).
  - Only when the task is marked done (✓) during an active locked day does it get removed from the backlog.
- **Historical Ledger Behavior**:
  - The **original day** the task was assigned always shows a Cross (✗) in the ledger — the task was not completed that day.
  - The **day it was finally completed** shows it as `Task Name (backlog of <date>)` with a Tick (✓), making it clear it was a carried-over item that got done.

### C. Recurring Tasks Page

A separate settings page where users define routines (e.g., "Gym", "Read 10 pages").

- When a new daily cycle generates, the app reads these templates and clones them onto the active planning list automatically.
- Users can tweak or delete recurring tasks before locking the day.

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| **Framework**      | Next.js 16 (App Router, TypeScript) |
| **Styling**        | CSS Modules (`.module.css`)         |
| **State Mgmt**     | Zustand                             |
| **Date/Time Math** | Day.js                              |
| **Auth**           | Firebase Auth (Google SSO)          |
| **Database**       | Cloud Firestore (real-time sync)    |
| **Hosting**        | TBD                                 |

---

## Design Aesthetic

- Strict **black, white, and dark blue** minimal palette
- Dark mode default
- Clean typography, tight spacing
- No visual clutter — every element earns its place on screen

## Design Reference

- See [DESIGN.md](file:///d:/PROJECTS/TASK-MANAGER/DESIGN.md)

---

## Non-Functional Requirements

- **Real-time sync**: Any tick on phone must instantly update on desktop (Firestore listeners)
- **Security**: Firestore rules must block task additions when day status is `locked`
- **Performance**: Instantaneous UI state toggling — no perceptible latency on lock/unlock transitions
- **Accessibility**: Keyboard-navigable, proper ARIA labels on interactive elements
- **Responsive**: Works on mobile and desktop

## Constraints & Assumptions

- Google is the only auth provider (no email/password)
- One active day cycle per user at any time
- The 24-hour window is absolute from lock time, not midnight-based
- Backlog items persist indefinitely until manually added back or deleted
