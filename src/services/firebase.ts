import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  User 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = false;

// Fallback logic to allow the app to be tested if dummy keys are used
const app = isFirebaseConfigured && !getApps().length ? initializeApp(firebaseConfig) : (getApps().length ? getApps()[0] : null);
export const auth = isFirebaseConfigured && app ? getAuth(app) : null;
export const db = isFirebaseConfigured && app ? getFirestore(app) : null;

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signIn = (email: string, pass: string) => {
  if (!auth) throw new Error('Firebase is not configured');
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUp = (email: string, pass: string) => {
  if (!auth) throw new Error('Firebase is not configured');
  return createUserWithEmailAndPassword(auth, email, pass);
};

export const signInWithGoogle = () => {
  if (!auth) throw new Error('Firebase is not configured');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logOut = () => {
  if (!auth) throw new Error('Firebase is not configured');
  return signOut(auth);
};
