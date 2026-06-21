import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Lazy singletons — initializeApp is only called when first accessed (client-side).
// useEffect / event handlers never run on the server, so these are safe in SSR.
let _app: FirebaseApp | undefined
let _auth: Auth | undefined
let _db: Firestore | undefined

function getApp(): FirebaseApp {
  if (!_app) {
    const apps = getApps()
    _app = apps.length ? apps[0] : initializeApp(firebaseConfig)
  }
  return _app
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp())
  return _auth
}

export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getApp())
  return _db
}
