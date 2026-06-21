import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  FirebaseError,
} from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(getFirebaseAuth(), googleProvider)
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) return 'Something went wrong. Please try again.'
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth())
}
