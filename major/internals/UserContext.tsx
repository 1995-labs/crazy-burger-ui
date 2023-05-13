// import * as Sentry from "@sentry/browser";
import firebase from "firebase/compat/app";
import { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "../../types/User";

type ContextType = {
  authUser: firebase.User;
  userRecord: UserType;
};

const UserContext = createContext<ContextType>({
  authUser: null,
  userRecord: null,
});

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState<firebase.User>(null);
  const [userRecord, setUserRecord] = useState<UserType>(null);

  const handleAuthStateChanged = (authState: firebase.User | null) => {
    authStateChanged(authState);
  };

  const authStateChanged = (authState: firebase.User | null) => {
    // setLoading(true);
    setAuthUser(authState);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(handleAuthStateChanged);
    return () => {
      unsubscribe();
      // userRecordRef.current && userRecordRef.current();
    };
  }, []);

  return (
    <UserContext.Provider value={{ authUser, userRecord }}>
      {children}
    </UserContext.Provider>
  );
};
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(UserContext);
