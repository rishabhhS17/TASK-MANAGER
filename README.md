# 🔒 LockIn

A minimalist, high-accountability daily task engine that forces a hard boundary between **planning your day** and **executing it**. Unlike standard todo apps that allow infinite mid-day reshuffling, LockIn operates as an unyielding state machine — once you lock your day, there's no going back.

## Why LockIn?

Most productivity apps fail because they let you endlessly reorganize instead of *doing*. LockIn eliminates that escape hatch:

- **Plan** your tasks freely during the unlocked phase
- **Lock** your day with a single irreversible click
- **Execute** — the only interaction left is checking tasks off
- **Face the music** — uncompleted tasks land in your Backlog with a ✗, visible forever

## Core Lifecycle

### Phase 1 → Planning (Unlocked)
Add tasks, pull items from the Backlog, tweak recurring templates — full edit rights. Ends when you press **Lock**.

### Phase 2 → Execution (Locked)
The system records a timestamp and starts a 24-hour countdown. All editing controls are stripped. You can only tick tasks as done ✓. This is enforced both in the UI and at the database level via Firestore security rules.

### Phase 3 → Expiration (Lazy Reset)
After 24 hours, the next time you open the app:
- Completed tasks → archived to history
- Uncompleted tasks → routed to the **Backlog** with a ✗
- A new planning cycle begins

## Features

| Feature | Description |
|---|---|
| **Lock Mechanism** | Irreversible day-lock with 24-hour execution window |
| **Backlog Store** | Persistent archive of all uncompleted tasks with original dates |
| **Recurring Tasks** | Define daily routines that auto-populate each new cycle |
| **Calendar Ledger** | Historical read-only view of past days — ✓ and ✗ for every task |
| **Google SSO** | One-click sign-in via Firebase Authentication |
| **Real-time Sync** | Firestore listeners keep all devices in sync instantly |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | CSS Modules |
| State Management | Zustand |
| Date/Time | Day.js |
| Auth | Firebase Auth (Google SSO) |
| Database | Cloud Firestore |

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login / authentication pages
│   └── (protected)/       # Authenticated routes
│       ├── page.tsx        # Home — daily task engine
│       ├── backlog/        # Backlog Store page
│       └── recurring/      # Recurring Tasks settings
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Firebase config & utility functions
├── store/                 # Zustand state stores
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- A **Firebase project** with Firestore and Google Authentication enabled

### 1. Clone the repository

```bash
git clone https://github.com/rishabhhS17/TASK-MANAGER.git
cd TASK-MANAGER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your Firebase config values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and populate each variable with your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> You can find these values in the [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps → Web app config.

### 4. Set up Firebase

Make sure your Firebase project has:
- **Authentication** → Google sign-in provider enabled
- **Cloud Firestore** → Database created (the app uses the `(default)` database)

If you want to deploy Firestore security rules:

```bash
npx -y firebase-tools@latest deploy --only firestore:rules
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production (optional)

```bash
npm run build
npm start
```

## Design

- **Dark mode** default
- Strict **black, white, and dark blue** palette
- Clean typography, tight spacing, zero visual clutter

## License

This project is private.
