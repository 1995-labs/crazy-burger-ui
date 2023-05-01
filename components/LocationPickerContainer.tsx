/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { CartAction, CartActionKind, LogisticsStateType } from "./CartDrawer";

type Props = {
  dispatch: React.Dispatch<CartAction>;
  state: LogisticsStateType;
};

export const LocationPickerContainer = ({ dispatch, state }: Props) => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
    debounce: 1500,
    options: {
      input: state.location.text,
      componentRestrictions: { country: "gh" },
    },
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectionReset = () => {
    dispatch({
      type: CartActionKind.SET_LOCATION_TEXT,
      payload: { text: "" },
    });
    setSelectedLocation(null);
    dispatch({ type: CartActionKind.RESET_LOCATION, payload: null });
  };

  useEffect(() => {
    if (selectedLocation && placesService) {
      placesService.getDetails(
        {
          placeId: selectedLocation.place_id,
        },
        (placeDetails) => {
          dispatch({
            type: CartActionKind.SET_LOCATION,
            payload: {
              lat: placeDetails.geometry.location.lat(),
              lng: placeDetails.geometry.location.lng(),
              text: selectedLocation.description,
            },
          });
          dispatch({
            type: CartActionKind.NEW_LOCATION,
            payload: {
              newLocation: true,
            },
          });
        }
      );
    }
  }, [selectedLocation, placesService]);

  const showPredictions = useCallback(
    () =>
      Array.isArray(placePredictions) &&
      placePredictions.length > 0 &&
      state.location.text.length > 0 &&
      !selectedLocation,
    [placePredictions, state, selectedLocation]
  );

  return (
    <Box>
      <Box m={2}>
        <FormControl>
          <InputGroup>
            <Input
              value={state.location.text}
              placeholder="Try a street address, nearby business or landmark"
              onChange={(event) => {
                const value = event.target.value;
                dispatch({
                  type: CartActionKind.SET_LOCATION_TEXT,
                  payload: { text: value },
                });
                getPlacePredictions({ input: value });
              }}
            />
            {isPlacePredictionsLoading && (
              <InputRightElement>
                <Spinner emptyColor="gray.200" color="red.500" />
              </InputRightElement>
            )}
            {!isPlacePredictionsLoading &&
              state.location.text &&
              state.location.text.trim().length > 0 && (
                <InputRightElement width="4.5rem">
                  <Button
                    variant="solid"
                    h="1.75rem"
                    size="sm"
                    onClick={handleSelectionReset}
                  >
                    Reset
                  </Button>
                </InputRightElement>
              )}
          </InputGroup>
        </FormControl>
      </Box>
      <Divider />

      <Collapse unmountOnExit in={showPredictions()} animateOpacity>
        <DelievrySuggestionInput
          setSuggestion={setSelectedLocation}
          suggestions={placePredictions}
        />
      </Collapse>
    </Box>
  );
};

const DelievrySuggestionInput = ({
  suggestions,
  setSuggestion,
}: {
  setSuggestion: React.Dispatch<any>;
  suggestions: google.maps.places.AutocompletePrediction[];
}) => {
  return (
    <>
      {/* <Divider /> */}
      {/* <Flex flexDirection={"column"}>
        {suggestions.map((suggestion) => (
          <Button my={0.5} mx={1} size={"sm"} width={"100%"}>
            {suggestion.description}
          </Button>
        ))}
      </Flex> */}
      <Box mx={4} my={2}>
        <FormControl as="fieldset">
          <FormLabel as="legend">Select suggestion: </FormLabel>
          <RadioGroup
            onChange={(e) => {
              const selected =
                suggestions &&
                suggestions.length > 0 &&
                suggestions.filter((place) => place.place_id === e);
              setSuggestion(selected[0]);
            }}
          >
            <Stack direction="column">
              {suggestions.map((item) => {
                return (
                  <Radio key={item.place_id} value={item.place_id}>
                    {item.description}
                  </Radio>
                );
              })}
            </Stack>
          </RadioGroup>
          {/* <FormHelperText>Alternatively, use nearest landmark.</FormHelperText> */}
        </FormControl>
      </Box>
      <Divider />
    </>
  );
};
