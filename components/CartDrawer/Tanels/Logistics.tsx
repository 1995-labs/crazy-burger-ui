import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { Car, ShoppingBag } from "lucide-react";
import React from "react";
// import { useCurrentPosition } from "react-use-geolocation";
import {
  CartAction,
  CartActionKind,
  LogisticsStateType,
  logisticsTypes,
} from "..";
import useUserLocations from "../../../hooks/useUserLocations";
import { useBranch } from "../../../major/internals/BranchContext";
import { useAuth } from "../../../major/internals/UserContext";
import { ClientType } from "../../../types/Client";
import { LocationPickerContainer } from "../../LocationPickerContainer";

export const Logistics = ({
  store,
  dispatch,
  state,
}: {
  store: ClientType;

  dispatch: React.Dispatch<CartAction>;
  state: LogisticsStateType;
}) => {
  const { branch } = useBranch();

  return (
    <Box width="100%">
      <BranchSelect />
      {branch && <LogisticsType dispatch={dispatch} state={state} />}
    </Box>
  );
};

type LocationTypes = "Saved" | "New";

export const LogisticsLocation = ({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<CartAction>;
  state: LogisticsStateType;
}) => {
  const { authUser } = useAuth();
  const [locationID, setLocationID] = React.useState("");
  const { loading, locations } = useUserLocations({ authUser });
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selectedLocation = locations.find((location) => location.id === id);
    if (selectedLocation) {
      // console.log({ selectedLocation });
      setLocationID(selectedLocation.id);
      dispatch({
        type: CartActionKind.SET_LOCATION,
        payload: {
          lat: Number(selectedLocation.lat),
          lng: Number(selectedLocation.lng),
          text: selectedLocation.label,
        },
      });
    } else {
      setLocationID("");

      dispatch({
        type: CartActionKind.RESET_LOCATION,
        payload: null,
      });
    }
    dispatch({
      type: CartActionKind.NEW_LOCATION,
      payload: {
        newLocation: false,
      },
    });
  };
  const [locationType, setLocationType] = React.useState<LocationTypes>(null);

  const reset = () => {
    setLocationID("");
    dispatch({
      type: CartActionKind.RESET_LOCATION,
      payload: null,
    });
  };

  const ToggleLocationChoice = (type: LocationTypes) => {
    setLocationID("");
    dispatch({
      type: CartActionKind.RESET_LOCATION,
      payload: null,
    });
    setLocationType(type);
  };

  const hasSavedLocations = locations.length > 0;

  return (
    <Box>
      <Box>
        <Box p={2}>
          <ButtonGroup width={"100%"} variant="outline">
            {/* {hasSavedLocations && ( */}
            <Button
              isLoading={loading}
              isDisabled={!hasSavedLocations}
              colorScheme={locationType === "Saved" ? "blue" : "gray"}
              variant={locationType === "Saved" ? "outline" : "outline"}
              onClick={() => ToggleLocationChoice("Saved")}
              width={"100%"}
              boxShadow={"sm"}
            >
              Use Saved Location
            </Button>
            {/* )} */}
            <Button
              colorScheme={locationType === "New" ? "blue" : "gray"}
              variant={locationType === "New" ? "outline" : "outline"}
              onClick={() => ToggleLocationChoice("New")}
              width={"100%"}
              boxShadow={"sm"}
            >
              Use New Location
            </Button>
          </ButtonGroup>
        </Box>

        <Divider />

        <Collapse unmountOnExit in={locationType === "Saved"} animateOpacity>
          <Box>
            <Box m={2}>
              <Select
                placeholder="Select a Location"
                onChange={handleLocationChange}
                disabled={locations.length === 0}
                value={locationID}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Box>
          <Divider />
        </Collapse>

        <Collapse unmountOnExit in={locationType === "New"} animateOpacity>
          <LocationPickerContainer dispatch={dispatch} state={state} />
        </Collapse>
      </Box>
    </Box>
  );
};

// const DetectLocation = ({
//   dispatch,
// }: {
//   dispatch: React.Dispatch<CartAction>;
// }) => {
//   const geolocation = useGeolocation({
//     enableHighAccuracy: true,
//   });
//   // const [position, error] = useCurrentPosition();
//   const toast = useToast();
//   const isMounted = React.useRef(false);

//   const isLoading =
//     !geolocation.error && !geolocation.latitude && !geolocation.latitude;

//   console.log({ isLoading });

//   useEffect(() => {
//     if (geolocation.error) {
//       toast({
//         title: geolocation.error,
//         description: "Please try again.",
//         status: "error",
//         isClosable: true,
//       });
//     }
//     if (geolocation.latitude && geolocation.latitude) {
//       console.log({ geolocation });
//       dispatch({
//         type: CartActionKind.SET_LOCATION,
//         payload: {
//           lat: geolocation.latitude,
//           lng: geolocation.longitude,
//           text: "",
//         },
//       });
//     }
//   }, [dispatch, geolocation, toast]);

//   React.useEffect(() => {
//     console.log("here");
//   }, []);

//   // if (!position && !error) {
//   //   return <p>Waiting...</p>;
//   // }

//   // if (error) {
//   //   return <p>{error.message}</p>;
//   // }
//   if (isLoading) {
//     return (
//       <Box display={"flex"} justifyContent={"center"}>
//         <Spinner />
//       </Box>
//     );
//   }

//   return <></>;
// };

const BranchSelect = () => {
  const { branch, setBranch, branches } = useBranch();

  if (branches.length === 1) {
    return <></>;
  }

  return (
    <Box my={2} mx={4}>
      <FormControl>
        <FormLabel>Select Branch:</FormLabel>
        <Select
          required
          disabled
          onChange={(e) =>
            setBranch(
              branches.find((branchRef) => branchRef.id === e.target.value)
            )
          }
          placeholder="Select branch"
          value={branch ? branch.id : ""}
        >
          {branches &&
            branches.map((branch) => (
              <option
                disabled={!branch.online}
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}
        </Select>
        <FormHelperText>You can change this from your profile.</FormHelperText>
      </FormControl>
    </Box>
  );
};

const LogisticsType = ({
  dispatch,
  state,
}: {
  state: LogisticsStateType;
  dispatch: React.Dispatch<CartAction>;
}) => {
  const handleTabsToggle = (value: string) => {
    dispatch({
      type: CartActionKind.SET_LOGISTICS,
      payload: { logistics: value as logisticsTypes },
    });
    dispatch({
      type: CartActionKind.SET_LOCATION,
      payload: { lat: null, lng: null, text: null },
    });
  };

  return (
    <Box>
      <Box p={2}>
        <ButtonGroup display={"flex"}>
          <Button
            boxShadow={"sm"}
            leftIcon={<ShoppingBag size="24px" />}
            colorScheme={state.logistics_type === "pickup" ? "blue" : "gray"}
            variant={state.logistics_type === "pickup" ? "outline" : "outline"}
            width={"100%"}
            onClick={() => handleTabsToggle("pickup")}
          >
            Pick Up
          </Button>
          <Button
            boxShadow={"sm"}
            leftIcon={<Car size="24px" />}
            colorScheme={state.logistics_type === "delivery" ? "blue" : "gray"}
            variant={
              state.logistics_type === "delivery" ? "outline" : "outline"
            }
            width={"100%"}
            onClick={() => handleTabsToggle("delivery")}
          >
            Delivery
          </Button>
        </ButtonGroup>
      </Box>
      <Divider />
    </Box>
  );
};

export default Logistics;
