import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};

typeof window !== "undefined" && firebase.initializeApp(firebaseConfig);

export const auth = typeof window !== "undefined" && firebase.app().auth();

export const firestore =
  typeof window !== "undefined" && firebase.app().firestore();

export const functions =
  typeof window !== "undefined" &&
  firebase.app().functions(process.env.NEXT_PUBLIC_GCP_LOCATION);

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
