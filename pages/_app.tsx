import { Box, ChakraProvider } from "@chakra-ui/react";
import { Unbounded } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { MajorProvider } from "../major";
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
          <MajorProvider>
            <Box height={"100vh"} className={"primaryFont"}>
              <Header />
              <Component {...pageProps} />
              <Analytics />
              <Footer />
            </Box>
          </MajorProvider>
        </ChakraProvider>
      </GoogleReCaptchaProvider>
    </>
  );
}

export default MyApp;
