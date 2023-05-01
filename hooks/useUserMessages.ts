import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserMessageType } from "../types/User";

type Props = {
  authUser: firebase.User;
};

const useUserMessages = ({ authUser }: Props) => {
  const [messages, setMessages] = React.useState<UserMessageType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("messages")
      // .orderBy("createdAt", "desc")
      // .where("createdBy", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .onSnapshot((snap) => {
        let documents: any[] = [];
        snap.forEach((doc) =>
          documents.push(
            {
              ...doc.data(),
              id: doc.id,
            }
            // as StoreType
          )
        );
        setMessages(documents);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { messages, loading };
};

export default useUserMessages;
