import { Box } from "@chakra-ui/layout";
import { UserOrderType } from "../types/User";
import OrderCard from "./OrderCard";

type Props = {
  // authUser: firebase.User;
  recentOrder: UserOrderType[];
};

export const RecentOrderPreview = ({ recentOrder }: Props) => {
  return (
    // <Box>
    <Box m={2}>
      {recentOrder.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </Box>
    // </Box>
  );
};

export default RecentOrderPreview;
