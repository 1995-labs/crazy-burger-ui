// import * as Sentry from "@sentry/browser";
import firebase from "firebase/compat/app";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { firestore } from "../firebase";
import { UserType } from "../types/User";

export type UserRecordType = {
  name: string;
  email: string;
  phoneNumber: string;
};

type ContextType = {
  record: UserRecordType;
};

const RecordContext = createContext<ContextType>({
  record: null,
});

export const RecordProvider = ({ children }) => {
  const [userRecord, setUserRecord] = useState<UserType>(null);
  const userRecordRef = useRef(null);
  // const initialLoading = useRef(true);
  const handleAuthStateChanged = async (authState: firebase.User | null) => {
    if (authState) {
      userRecordRef.current = await firestore
        .collection("users")
        .doc(authState.uid)
        .onSnapshot((snap) => {
          if (snap.exists) {
            setUserRecord({
              ...(snap.data() as UserType),
              phoneNumber: authState.phoneNumber,
            });
          }
        });
    } else {
      userRecordRef.current && userRecordRef.current();
      setUserRecord(null);
      userRecordRef.current = null;
    }
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(handleAuthStateChanged);
    return () => {
      unsubscribe();
      userRecordRef.current && userRecordRef.current();
    };
  }, []);

  return (
    <RecordContext.Provider value={{ record: userRecord }}>
      {children}
    </RecordContext.Provider>
  );
};
// custom hook to use the authUserContext and access authUser and loading
export const useUserRecord = () => useContext(RecordContext);
