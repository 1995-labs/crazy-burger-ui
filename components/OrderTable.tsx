import { Box, Spinner } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import React from "react";

// import { CheckIcon } from "@heroicons/react/outline";
import InfiniteScroll from "react-infinite-scroll-component";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";
import OrderCard from "./OrderCard";
type Props = {
  authUser: firebase.User;
  onClose: () => void;
  // notifications: any;
};

export const formatOrderDateShort = (order: UserOrderType) => {
  const date = order.createdAt.toDate();

  const shortTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    // month: "2-digit",
    // day: "2-digit",
    // year: "numeric",
  });
  return shortTime;
};

export const formatOrderDate = (order: UserOrderType) => {
  const date = order.createdAt.toDate();

  return date.toLocaleString("en-US", {
    // hour: "numeric",
    // minute: "numeric",
    // hour12: true,
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

export const OrderTable = ({ authUser, onClose }: Props) => {
  const [last, setLast] = React.useState<any>();
  const [list, setList] = React.useState<UserOrderType[]>([]);
  const [hasMore, setHasMore] = React.useState(false);

  React.useEffect(() => {
    const first = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .where("status", "in", [
        "PAID",
        "CANCELLED",
        "IN-PROGRESS",
        "READY",
        "COMPLETED",
      ])

      .where("store", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .limit(6);

    first.onSnapshot((documentSnapshots) => {
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      const list = [];
      documentSnapshots.forEach(function (doc) {
        list.push({ ...doc.data(), id: doc.id });
      });
      setList(list);
      setLast(lastVisible);
      setHasMore(!documentSnapshots.empty);
    });
  }, []);

  const next = () => {
    const next = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .where("status", "in", [
        "PAID",
        "CANCELLED",
        "IN-PROGRESS",
        "READY",
        "COMPLETED",
      ])
      // .orderBy("createdAt", "desc")
      .where("store", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)

      .startAfter(last)
      .limit(4);

    next.onSnapshot((documentSnapshots) => {
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      const new_list = [];
      documentSnapshots.forEach((doc) => {
        new_list.push({ ...doc.data(), id: doc.id });
      });
      const updatedList = [...list, ...new_list];
      setList(updatedList);
      setLast(lastVisible);
    });
  };

  return (
    <Box
      // mt={2}
      id="scrollableDiv"
      style={{
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InfiniteScroll
        dataLength={list.length} //This is important field to render the next data
        next={next}
        // height="100%"
        scrollableTarget="scrollableDiv"
        hasMore={hasMore}
        // style={{ display: "flex", flexDirection: "column" }} //To put endMessage and loader to the top.
        // inverse={true} //
        loader={
          <Box width="100%" my={4} display="flex" justifyContent="center">
            <Spinner
              // thickness="4px"
              speed="1s"
              emptyColor="gray.200"
              // color="orange.500"
              size="md"
            />
          </Box>
        }
        endMessage={
          // <p style={{ textAlign: "center" }}>
          //   <b>No orders</b>
          // </p>
          <></>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
      >
        <Box mt={4}>
          {list.map((order) => (
            <OrderCard order={order} key={order.id} />
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
};
