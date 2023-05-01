import * as React from "react";
import { firestore } from "../firebase";
import { ClientBranchType } from "../types/Client";

export const useGetStoreBranches = () => {
  const [branches, setBranches] = React.useState<ClientBranchType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("branches")
      .onSnapshot((snap) => {
        const local_branches: ClientBranchType[] = [];
        snap.forEach((res) => {
          local_branches.push({ ...(res.data() as ClientBranchType) });
        });
        setBranches(local_branches);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { branches, loading };
};
