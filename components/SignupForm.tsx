import { Box } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";

import "firebaseui/dist/firebaseui.css";
import * as React from "react";

export const SignupForm = () => {
  const uiConfig: firebaseui.auth.Config = {
    signInOptions: [
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: "image",
          size: "invisible",
          badge: "bottomright",
        },
        defaultCountry: "GH",
        // whitelistedCountries: ["GH", "US", "GB"],
        whitelistedCountries: ["GH", "+233"],
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        return false;
      },
    },
  };
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    firebaseUiWidget.setConfig(uiConfig);
    firebaseUiWidget.start(elementRef.current, uiConfig);

    // return () => {};
  }, []);

  // if (!show) return <PageLoader />;

  return (
    <Box>
      <div className={"StyledFirebaseAuth"} ref={elementRef} />

      {/* <StyledFirebaseAuth
        className={
          colorMode === "light" ? "StyledFirebaseAuth" : "StyledFirebaseAuth2"
        }
        uiConfig={uiConfig}
        firebaseAuth={auth}
      /> */}
    </Box>
  );
};
