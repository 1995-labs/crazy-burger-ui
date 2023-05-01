import { Box, ChakraProvider } from "@chakra-ui/react";
import { Unbounded } from "@next/font/google";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { BranchProvider } from "../contexts/BranchContext";
import { CartProvider } from "../contexts/CartContext";
import { OrderNotificationContextProvider } from "../contexts/OrderNotificationContext";
import { RecordProvider } from "../contexts/RecordContext";
import { RewardsProvider } from "../contexts/RewardsContext";
import { SearchContextProvider } from "../contexts/SearchContext";
import { StoreMenuContextProvider } from "../contexts/StoreMenuContext";
import { StoreStatusProvider } from "../contexts/StoreStatusContext";
import { StoreTagsContextProvider } from "../contexts/StoreTagsContext";
import { UserProvider } from "../contexts/UserContext";
import { Footer } from "../shared/Footer";
import { Header } from "../shared/Header";
import "../styles/globals.css";
import theme from "../theme";
const inter = Unbounded({ subsets: ["latin"] });
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/crazy_burger_logo.png"
        ></link>
        <title>Crazy Burger - Order Online</title>
      </Head>
      <Script
        defer
        data-domain="crazyburgergh.com"
        src="https://plausible.io/js/script.js"
      />
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
        .primaryFont {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
      >
        <ChakraProvider theme={theme}>
          <UserProvider>
            <RecordProvider>
              <RewardsProvider>
                <CartProvider>
                  <BranchProvider>
                    <StoreStatusProvider>
                      <StoreMenuContextProvider>
                        <StoreTagsContextProvider>
                          <OrderNotificationContextProvider>
                            <SearchContextProvider>
                              <Box height={"100vh"} className={"primaryFont"}>
                                <Header />
                                <Component {...pageProps} />
                                <Footer />
                              </Box>
                            </SearchContextProvider>
                          </OrderNotificationContextProvider>
                        </StoreTagsContextProvider>
                      </StoreMenuContextProvider>
                    </StoreStatusProvider>
                  </BranchProvider>
                </CartProvider>
              </RewardsProvider>
            </RecordProvider>
          </UserProvider>
        </ChakraProvider>
      </GoogleReCaptchaProvider>
    </>
  );
}

export default MyApp;
