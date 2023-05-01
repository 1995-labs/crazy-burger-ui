import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import * as EmailValidator from "email-validator";
import firebase from "firebase/compat";
// import { Save } from "lucide-react";
import React from "react";
import { FiSave } from "react-icons/fi";
import { firestore } from "../firebase";

export const AddEmailToAccount = ({
  authUser,
}: {
  authUser: firebase.User;
}) => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [submittingEmail, setSubmittingEmail] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const toast = useToast();

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingEmail(true);
    setIsError(false);
    if (!EmailValidator.validate(email)) {
      setIsError(true);
      setSubmittingEmail(false);
      return;
    }

    firestore
      .collection("users")
      .doc(authUser.uid)
      .update({
        email,
        name,
      })
      .then((res) => {
        toast({
          title: "Profile Updated",
          status: "success",
          position: "top",
        });
      })
      .catch((err) => {
        console.error({ err });
        toast({
          title: "Failed to update profile ",
          status: "error",
          description: err && err.message,
          position: "top",
        });
        // setError(err);
      })
      .finally(() => {
        setSubmittingEmail(false);
      });
  };
  return (
    <Box position="relative">
      <Box m={2}>
        <Alert status="info" boxShadow="sm" borderRadius={"md"}>
          <AlertIcon />
          Please complete your profile to continue
        </Alert>
      </Box>
      <Divider />
      <Box my={2}>
        <form onSubmit={handleEmailSubmit}>
          <Box m={4}>
            <FormControl id="name">
              <FormLabel>Your Name:</FormLabel>
              <Input
                // isInvalid={isError}
                name="name"
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
                type="text"
                isRequired
                placeholder="Nana Yaw"
                size={"lg"}
              />
              <FormHelperText>For addressing you</FormHelperText>
            </FormControl>
          </Box>
          <Divider />
          <Box m={4}>
            <FormControl id="email" mt={2}>
              <FormLabel>Your Email:</FormLabel>
              <Input
                isInvalid={isError}
                name="email"
                value={email ? email : ""}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                isRequired
                placeholder="nanayaw@gmail.com"
                size={"lg"}
              />
              <FormHelperText>For sending your email receipts</FormHelperText>
            </FormControl>
          </Box>
          <Divider />
          <Box m={2}>
            <Button
              width={"100%"}
              colorScheme="green"
              type="submit"
              boxShadow={"md"}
              // width="50%"
              leftIcon={<FiSave size="24px" />}
              variant="solid"
              id="update-profile-button"
              isLoading={submittingEmail}
              loadingText="Submitting"
              size="lg"
              // mb={6}
            >
              Complete Profile
            </Button>
          </Box>
        </form>
      </Box>
      <Divider />
    </Box>
  );
};

// export default AddEmailToAccount
