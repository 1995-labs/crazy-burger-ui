/* eslint-disable react/no-children-prop */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useToast,
} from "@chakra-ui/react";
import * as EmailValidator from "email-validator";
import * as React from "react";
import { FiRefreshCw, FiSave } from "react-icons/fi";
import { useAuth } from "../contexts/UserContext";
import { firestore } from "../firebase";
import { UserType } from "../types/User";

type StateProps = UserType & {
  // password: string;
  // displayName: string;
};

export const UserEditForm = ({
  onClose,
  record,
}: {
  record: UserType;
  onClose: () => void;
}) => {
  const { authUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = React.useState<StateProps>({
    phoneNumber: authUser.phoneNumber && authUser.phoneNumber.slice(4),
    email: record.email,
    name: record.name,
  });
  const [error, setError] = React.useState<null | string>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [hasChange, setHasChange] = React.useState(false);

  React.useEffect(() => {
    profile.name &&
      profile.name.length > 0 &&
      profile.email &&
      profile.email.length > 0 &&
      setHasChange(
        profile.name.trim() !== record.name ||
          profile.email.trim() !== record.email
      );
  }, [profile, record]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!EmailValidator.validate(profile.email)) {
      setError("Invalid Email");
      setSubmitting(false);

      return;
    }

    firestore
      .collection("users")
      .doc(authUser.uid)
      .update({
        name: profile.name,
        email: profile.email,
      })
      .then((res) => {
        toast({
          title: "Profile Updated",
          status: "success",
          position: "top",
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
    <Box>
      {error && (
        <Alert my={2} status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <FormControl mt={1} mb={2} id="phone">
        <FormLabel>Phone:</FormLabel>
        <InputGroup size={"lg"}>
          <InputLeftAddon children="+233" />
          <Input
            readOnly
            onChange={handleChange}
            name="phoneNumber"
            value={profile.phoneNumber}
            type="tel"
            disabled
            placeholder="phone number"
          />
        </InputGroup>
        <FormHelperText>So we can reach you about your orders</FormHelperText>
      </FormControl>

      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <Stack spacing={2} width="100%" justifyContent="center">
          <FormControl id="displayName">
            <FormLabel>Name:</FormLabel>
            <Input
              name="name"
              value={profile.name ? profile.name : ""}
              onChange={handleChange}
              type="text"
              isRequired
              placeholder="Nana Yaw..."
              size={"lg"}
            />
            <FormHelperText>So we address you correctly</FormHelperText>
          </FormControl>

          <FormControl id="email">
            <FormLabel>Email:</FormLabel>
            <Input
              name="email"
              value={profile.email ? profile.email : ""}
              onChange={handleChange}
              type="text"
              isRequired
              placeholder="nanayaw@gmail.com"
              size={"lg"}
            />
            <FormHelperText>So you can receieve email receipts</FormHelperText>
          </FormControl>

          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Button
              // mt={2}
              colorScheme="green"
              type="submit"
              disabled={!hasChange}
              // width="65%"
              width={"100%"}
              // variant="outline"
              id="update-profile-button"
              isLoading={submitting}
              loadingText="Submitting"
              size="lg"
              leftIcon={<FiSave size="24px" />}
              // mb={6}
            >
              Update
            </Button>

            {/* {hasChange && ( */}
            <Button
              // colorScheme="orange"
              // type="submit"
              disabled={!hasChange}
              // width="65%"
              width={"100%"}
              onClick={() => {
                setProfile({
                  phoneNumber:
                    authUser.phoneNumber && authUser.phoneNumber.slice(4),
                  email: record.email,
                  name: record.name,
                });
                setError(null);
              }}
              // variant="outline"
              mt={2}
              // id="update-profile-button"
              // isLoading={submitting}
              // loadingText="Submitting"
              size="lg"
              leftIcon={<FiRefreshCw size="24px" />}
              // mb={6}
            >
              Reset
            </Button>
            {/* )} */}
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
