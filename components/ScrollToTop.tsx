import { IconButton } from "@chakra-ui/react";
import { ChevronDoubleUpIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 100 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  //scroll-to-top classes: fixed, bottom:0, right:0
  return (
    <div
      className="scroll-to-top"
      style={{ position: "fixed", bottom: 20, right: 20 }}
    >
      {isVisible && (
        // <div onClick={scrollToTop}>
        <IconButton
          size="lg"
          aria-label="scroll to the top"
          borderRadius="full"
          colorScheme="red"
          boxShadow="2xl"
          onClick={scrollToTop}
          icon={<ChevronDoubleUpIcon width="28px" />}
        />
      )}
    </div>
  );
}
