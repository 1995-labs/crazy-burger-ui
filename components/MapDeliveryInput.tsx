import { Box, Spinner } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { memo, useCallback, useState } from "react";
import { CartAction, CartActionKind, LogisticsStateType } from "./CartDrawer";

type Props = {
  statefulCoords: {
    lat: number;
    lng: number;
  };
  setStatefulCoords: any;
};

const options = {
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false,
  zoomControl: true,
  fullscreenControl: false,
  minZoom: 15,
  maxZoom: 20,
  scrollwheel: false,
};

const containerStyle = {
  height: "220px",
};

export const MapDeliveryInput = ({
  state,
  dispatch,
}: {
  state: LogisticsStateType;
  dispatch: React.Dispatch<CartAction>;
}) => {
  const [map, setMap] = useState(null);
  // const [localCoords, setLocalCoords] = useState({
  //   lat: null,
  //   lng: null,
  // });
  // const [showMap, setShowMap] = useState(false);
  const [zoom] = useState(16);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
  });

  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds({
        lat: state.location.lat,
        lng: state.location.lng,
      });
      map.fitBounds(bounds);
      setMap(map);
    },
    [state]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (isLoaded) {
    return (
      <Box m={2}>
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={containerStyle}
          onUnmount={onUnmount}
          options={options}
          zoom={zoom}
          center={{ lat: state.location.lat, lng: state.location.lng }}
        >
          <Marker
            position={{ lat: state.location.lat, lng: state.location.lng }}
            draggable={true}
            onDragEnd={(coords) => {
              dispatch({
                type: CartActionKind.SET_LOCATION,
                payload: {
                  lat: coords.latLng.lat(),
                  lng: coords.latLng.lng(),
                  text: state.location.text,
                },
              });
            }}
          />
        </GoogleMap>
      </Box>
    );
  }
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Spinner />
    </Box>
  );
};

export default memo(MapDeliveryInput);

// export default MapDeliveryInput;
