import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";

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
};

let app: firebase.app.App;

if (typeof window !== "undefined") {
  // firebase.initializeApp(firebaseConfig);
  if (firebase.apps.length > 0) {
    app = firebase.app();
  } else {
    app = firebase.initializeApp(firebaseConfig);
  }
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
