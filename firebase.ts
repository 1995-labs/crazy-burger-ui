import "firebase/compat/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/app-check";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/messaging";
import "firebase/compat/performance";

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: any;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

let app: firebase.app.App;

if (typeof window !== "undefined") {
  // firebase.initializeApp(firebaseConfig);
  if (firebase.apps.length > 0) {
    app = firebase.app();
  } else {
    app = firebase.initializeApp(firebaseConfig);
  }
  // if ("measurementId" in firebaseConfig) firebase.analytics();
  // firebase.performance();
}
// const appCheck = typeof window !== "undefined" && firebase.appCheck();
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// typeof window !== "undefined" &&
//   appCheck.activate(process.env.NEXT_PUBLIC_APP_CHECK_KEY, true);

export const auth = typeof window !== "undefined" && firebase.app().auth();
// auth.useEmulator("http://localhost:9099");
export const firestore =
  typeof window !== "undefined" && firebase.app().firestore();
// firestore.useEmulator('localhost', 8080);
export const functions =
  typeof window !== "undefined" && firebase.app().functions();
// functions.useEmulator("localhost", 5001);
// export const messaging = app.messaging();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export default app;
