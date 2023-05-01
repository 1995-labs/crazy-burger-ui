import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { useRemoteConfig } from "../contexts/RemoteConfigContext";

export const ColorModeToggle = () => {
  const { flags } = useRemoteConfig();

  const { colorMode, toggleColorMode } = useColorMode();
  const Icon =
    colorMode === "dark" ? <SunIcon width="24px" /> : <MoonIcon width="24px" />;
  return (
    <IconButton aria-label="Theme" onClick={toggleColorMode} icon={Icon} />
  );
};
