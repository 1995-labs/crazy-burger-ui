import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import { useAuth } from "../major/internals/UserContext";
function ProfileHomeView({}: // authUser,
// setProfileView,
{
  // authUser: firebase.User;
  // setProfileView: React.Dispatch<React.SetStateAction<view>>;
}) {
  const { authUser } = useAuth();
  return (
    <Box>
      <Heading textAlign="center" as="h2" size="lg">
        👋🏾 {authUser.displayName}
      </Heading>
      <Box mt={10}>
        <VStack spacing={4}>
          {/* <Button
            variant="ghost"
            size="lg"
            disabled
            // width="100%"
            onClick={() => setProfileView("MESSAGES")}
            leftIcon={<InboxIcon width="24px" />}
          >
            Message Center
          </Button>
          <Button
            variant="ghost"
            size="lg"
            disabled
            onClick={() => setProfileView("RSVP")}
            // width="100%"
            leftIcon={<CalendarIcon width="24px" />}
          >
            Reservations
          </Button> */}
          <Button
            variant="ghost"
            size="lg"
            // onClick={() => setProfileView("SETTINGS")}
            // width="100%"
            leftIcon={<AdjustmentsIcon width="24px" />}
          >
            Settings
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default ProfileHomeView;
