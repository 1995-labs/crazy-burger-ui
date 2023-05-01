/* eslint-disable react/no-children-prop */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as EmailValidator from "email-validator";
import firebase from "firebase/compat";
import { useMemo, useState } from "react";
import { FiLogOut, FiRefreshCw, FiSave, FiUser, FiX } from "react-icons/fi";
import { UserRecordType } from "../contexts/RecordContext";
import { auth, firestore } from "../firebase";
// import useUserRecord from "../hooks/useUserRecord";
import { UserType } from "../types/User";

export const ProfileDrawer = ({
  authUser,
  record,
}: {
  authUser: firebase.User;
  record: UserRecordType;
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<UserType>({
    phoneNumber: authUser.phoneNumber && authUser.phoneNumber.slice(4),
    email: record.email,
    name: record.name,
  });
  const [error, setError] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState(false);
  const isIncompleteAlert = record && (!record.name || !record.email);
  const hasChange = useMemo(
    () => profile.name !== record.name || profile.email !== record.email,
    [profile.email, profile.name, record.email, record.name]
  );

  const hasEmptyFields =
    profile.email.trim().length === 0 || profile.name.trim().length === 0;

  const onDrawerClose = () => {
    setProfile({
      phoneNumber: authUser.phoneNumber && authUser.phoneNumber.slice(4),
      email: record.email,
      name: record.name,
    });
    onClose();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const email = profile.email.trim();

    if (!EmailValidator.validate(email)) {
      setError("Invalid Email");
      setSubmitting(false);

      return;
    }

    firestore
      .collection("users")
      .doc(authUser.uid)
      .update({
        name: profile.name,
        email,
      })
      .then((res) => {
        toast({
          title: "Profile Updated",
          status: "success",
          position: "top",
          duration: 1000,
        });
        onClose();
      })
      .catch((err) => {
        console.error({ err });
        setError(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <>
      <IconButton
        aria-label="Profile"
        boxShadow={"sm"}
        onClick={onOpen}
        icon={<FiUser size="24px" />}
      ></IconButton>

      <Drawer
        isOpen={isOpen}
        placement="right"
        size="sm"
        onClose={onDrawerClose}
      >
        <DrawerOverlay />
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <DrawerContent>
            <DrawerHeader
              fontWeight="black"
              textAlign="center"
              // border={"1px solid #e2e8f0"}
              className={"primaryFont"}
            >
              Account
            </DrawerHeader>
            {/* <DrawerCloseButton size="lg" /> */}
            <Divider />
            <DrawerBody padding={0}>
              <Box>
                {isIncompleteAlert && (
                  <Alert status="warning">
                    <AlertIcon />
                    Please provide an email address and name to complete your
                    profile
                  </Alert>
                )}
                <Box mx={4}>
                  <Box>
                    {error && (
                      <Alert my={2} status="error">
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}
                    <FormControl mt={4} mb={2} id="phone">
                      <FormLabel>Phone:</FormLabel>
                      <InputGroup size={"lg"}>
                        <InputLeftAddon children="+233" />
                        <Input
                          readOnly
                          // onChange={handleChange}
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          type="tel"
                          disabled
                          placeholder="phone number"
                        />
                      </InputGroup>
                      <FormHelperText>
                        We may reach you about your orders
                      </FormHelperText>
                    </FormControl>

                    <Stack spacing={2} width="100%" justifyContent="center">
                      <FormControl id="displayName">
                        <FormLabel>Name:</FormLabel>
                        <Input
                          name="name"
                          value={profile.name ?? ""}
                          onChange={handleChange}
                          type="text"
                          isRequired
                          placeholder="Nana Yaw..."
                          size={"lg"}
                        />
                        <FormHelperText>
                          We can address you correctly
                        </FormHelperText>
                      </FormControl>

                      <FormControl id="email">
                        <FormLabel>Email:</FormLabel>
                        <Input
                          name="email"
                          value={profile.email ?? ""}
                          onChange={handleChange}
                          type="text"
                          isRequired
                          placeholder="nanayaw@gmail.com"
                          size={"lg"}
                        />
                        <FormHelperText>
                          You will receieve email receipts
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </DrawerBody>

            <Divider />

            <DrawerFooter p={1}>
              <Stack width={"100%"}>
                <Button
                  colorScheme="green"
                  type="submit"
                  variant={"solid"}
                  isDisabled={hasEmptyFields || !hasChange}
                  width={"100%"}
                  id="update-profile-button"
                  isLoading={submitting}
                  loadingText="Submitting"
                  size="lg"
                  boxShadow={"sm"}
                  leftIcon={<FiSave size="24px" />}
                >
                  Update Profile
                </Button>
                <Button
                  isDisabled={!hasChange}
                  width={"100%"}
                  size="lg"
                  boxShadow={"sm"}
                  onClick={() => {
                    setProfile({
                      phoneNumber:
                        authUser.phoneNumber && authUser.phoneNumber.slice(4),
                      email: record.email,
                      name: record.name,
                    });
                    setError(null);
                  }}
                  leftIcon={<FiRefreshCw size="24px" />}
                >
                  Reset
                </Button>
                <Divider />
                <HStack spacing={1}>
                  <Button
                    colorScheme="red"
                    width={"100%"}
                    variant={"solid"}
                    boxShadow={"sm"}
                    leftIcon={<FiLogOut size="24px" />}
                    size="lg"
                    onClick={async () => {
                      onClose();
                      await auth.signOut();
                    }}
                  >
                    Log out
                  </Button>
                  <Button
                    width={"100%"}
                    size="lg"
                    onClick={onDrawerClose}
                    leftIcon={<FiX size="24px" />}
                  >
                    Close
                  </Button>
                </HStack>
              </Stack>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
