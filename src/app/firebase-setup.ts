import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
  enableIndexedDbPersistence,
  clearIndexedDbPersistence,
} from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

export const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

if (
  import.meta.env.VITE_FIREBASE_EMULATORS === "true" &&
  import.meta.env.VITE_FIREBASE_EMULATOR_HOSTNAME &&
  import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_URL &&
  import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT
) {
  console.warn("ENABLING FIREBASE EMULATORS");

  // clearIndexedDbPersistence(db);

  connectFirestoreEmulator(
    db,
    import.meta.env.VITE_FIREBASE_EMULATOR_HOSTNAME,
    Number(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT),
  );

  connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_URL);
}

// enableIndexedDbPersistence(db)
//   .then(() => console.debug("Offline persistence enabled in this tab."))
//   .catch((err) => console.error("Offline persistence failed.", err));

enableMultiTabIndexedDbPersistence(db)
  .then(() => console.debug("Offline persistence enabled."))
  .catch((err) => console.error("Offline persistence failed.", err));
