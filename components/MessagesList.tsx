import firebase from "firebase/compat/app";
import React from "react";
import useUserMessages from "../hooks/useUserMessages";

function MessagesList({ authUser }: { authUser: firebase.User }) {
  const { messages, loading } = useUserMessages({ authUser });

  // console.log({ messages, loading });
  if (loading) {
    return <></>;
  }
  return (
    <div>
      list
      {/* <Code>{messages[0].createdFor}</Code> */}
    </div>
  );
}

export default MessagesList;
