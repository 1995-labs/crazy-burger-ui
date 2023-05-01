import firebase from "firebase/compat/app";
import { firestore } from "../firebase";

export const updateUserCollectionEmail = async (
  user: firebase.User,
  email: string
) =>
  await firestore.collection("users").doc(user.uid).update({
    email,
  });

export const updateUserCollectionPhoneNumber = async (
  user: firebase.User,
  phoneNumber: string
) =>
  await firestore.collection("users").doc(user.uid).update({
    phoneNumber,
  });

export const updateUserCollectionName = async (displayName: string) => {
  const user = firebase.auth().currentUser;

  if (user) {
    user.updateProfile({ displayName });
  }
};
