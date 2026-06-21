import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(getFirebaseAuth(), googleProvider)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth())
}
