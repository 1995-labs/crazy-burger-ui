import React, { useState } from "react";
import { useWindowSize } from "./useWindowSize";

export const useSmallLayout = () => {
  const mobileBreakPoint = 414;
  const { width } = useWindowSize();
  const [isSmall, setIsSmall] = useState(width <= mobileBreakPoint);

  React.useEffect(() => {
    setIsSmall(width < mobileBreakPoint);
  }, [width]);

  return {
    isSmall,
  };
};

export default useSmallLayout;
