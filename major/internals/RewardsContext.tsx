import { useToast } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  UserCheckoutDiscountType,
  transform,
} from "../../components/UserCentric";
import { firestore } from "../../firebase";

const RewardsContext = createContext<{ rewards: UserCheckoutDiscountType }>({
  rewards: { checkout_discount: null, id: null, lifetime_total: null },
});

export const RewardsProvider = ({ children }) => {
  const [rewards, setRewards] = useState<UserCheckoutDiscountType>(null);
  const userDiscountsRef = useRef(null);
  const id = "test-toast";
  const toast = useToast();

  useEffect(() => {
    if (rewards && rewards.checkout_discount) {
      if (!toast.isActive(id)) {
        toast({
          id,
          title:
            "You have a " + transform(rewards.checkout_discount) + " discount",
          description: "Discount will be applied at checkout",
          status: "info",
          duration: null,
          isClosable: true,
        });
      }
    }
  }, [rewards]);

  const handleAuthStateChanged = async (authState: firebase.User | null) => {
    if (authState) {
      userDiscountsRef.current = firestore
        .collection("users")
        .doc(authState.uid)
        .collection("rewards")
        .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
        .onSnapshot((snap) => {
          if (snap.exists) {
            setRewards({ ...(snap.data() as UserCheckoutDiscountType) });
          }
        });
    } else {
      userDiscountsRef.current && userDiscountsRef.current();
      userDiscountsRef.current && toast.close(id);
      setRewards(null);
      userDiscountsRef.current = null;
    }
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(handleAuthStateChanged);
    return () => {
      unsubscribe();
      userDiscountsRef.current && userDiscountsRef.current();
    };
  }, []);

  return (
    <RewardsContext.Provider value={{ rewards }}>
      {children}
    </RewardsContext.Provider>
  );
};
// custom hook to use the authUserContext and access authUser and loading
export const useUserRewards = () => useContext(RewardsContext);
