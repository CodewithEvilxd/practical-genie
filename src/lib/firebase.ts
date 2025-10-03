import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getClientEnv } from "@/lib/env";

let appSingleton: FirebaseApp | null = null;
let authSingleton: Auth | null = null;
let storageSingleton: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (appSingleton) return appSingleton;
  const env = getClientEnv();
  const config = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  appSingleton = getApps().length ? getApps()[0] : initializeApp(config);
  return appSingleton;
}

export function getFirebaseAuth(): Auth {
  if (authSingleton) return authSingleton;
  const app = getFirebaseApp();
  authSingleton = getAuth(app);
  return authSingleton;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (storageSingleton) return storageSingleton;
  const app = getFirebaseApp();
  storageSingleton = getStorage(app);
  return storageSingleton;
}

export const googleProvider = new GoogleAuthProvider();


