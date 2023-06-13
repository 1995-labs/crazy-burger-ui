import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Map, Power, PowerOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
// import { Map } from "lucide-react";

import { useRouter } from "next/router";
import {
  FiCheck,
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiTwitter,
  FiX,
} from "react-icons/fi";
import { useBranch } from "../major/internals/BranchContext";
import { charka_dark_color } from "./Header";

export const LocationPopper = () => {
  const {
    branch,
    setBranch,
    loading,
    branches,
    showQuickView,
    setShowQuickView,
  } = useBranch();
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState(null);

  React.useEffect(() => {
    if (branch) {
      setSelectedBranch(branch);
    }
  }, [branch]);

  const handleClose = () => {
    setSelectedBranch(branch);
    setShowQuickView(false);
  };

  return (
    <Popover isOpen={showQuickView} onClose={handleClose}>
      <PopoverTrigger>
        <IconButton
          isLoading={loading}
          icon={<FiMapPin size="24px" />}
          aria-label="Map"
          onClick={() => {
            setShowQuickView(true);
          }}
          boxShadow={"sm"}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        {/* <PopoverCloseButton onClick={() => setShowQuickView(false)} /> */}

        <PopoverBody p={0}>
          <Flex p={2} justifyContent={"center"}>
            <FiMapPin size="24px" />
            <Text ml={2} fontWeight={"bold"}>
              Change Branch
            </Text>
          </Flex>
          <Divider />
          <Box>
            <Skeleton isLoaded={!loading}>
              <VStack p={2}>
                {branches.map((branch) => (
                  <Button
                    boxShadow={"sm"}
                    width={"100%"}
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    leftIcon={
                      branch.online ? (
                        <Power size={"24px"} />
                      ) : (
                        <PowerOff size={"24px"} />
                      )
                    }
                    // colorScheme={branch.online ? "green" : "red"}
                    colorScheme="blue"
                    // variant={"ghost"}
                    variant={
                      selectedBranch?.id === branch.id ? "solid" : "outline"
                    }
                  >
                    {branch.name} {branch.online ? "" : "(Offline)"}
                  </Button>
                ))}
              </VStack>
            </Skeleton>
          </Box>
          <Divider />
          <ButtonGroup width={"100%"} p={2}>
            {/*  */}
            <Button
              boxShadow={"sm"}
              colorScheme="green"
              variant={"solid"}
              isDisabled={!selectedBranch}
              onClick={() => {
                setBranch(selectedBranch);
                setShowQuickView(false);
              }}
              width={"100%"}
              leftIcon={<FiCheck size={"24px"} />}
            >
              Set Branch
            </Button>
            <IconButton
              icon={<FiX size={"24px"} />}
              aria-label="Close"
              variant={"outline"}
              onClick={handleClose}
            />
          </ButtonGroup>
          <Divider />
          <Box p={2}>
            <Button
              onClick={() =>
                router.push(
                  `https://maps.google.com/?q=${branch.coordinates.lat},${branch.coordinates.lng}`
                )
              }
              width={"100%"}
              leftIcon={<Map size={"24px"} />}
            >
              Open Directions
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const Footer = () => {
  const value = useColorModeValue("white", charka_dark_color);

  return (
    <Box width="100%" position={"fixed"} bottom={0} zIndex={3}>
      <Divider />
      <Flex
        p={2}
        justifyContent="space-between"
        backgroundColor={value}
        as="footer"
      >
        <Box>
          <ButtonGroup variant="outline">
            <LocationPopper />

            <Link
              fontWeight="bold"
              target="_blank"
              rel="noreferrer"
              // color="red.100"
              href="https://www.instagram.com/crazyburgergh"
            >
              <IconButton
                boxShadow={"sm"}
                icon={<FiInstagram size="24px" />}
                aria-label="Instagram"
              />
            </Link>
            <Link
              fontWeight="bold"
              target="_blank"
              rel="noreferrer"
              // color="red.100"
              href="https://www.facebook.com/crazyburgergh"
            >
              <IconButton
                boxShadow={"sm"}
                icon={<FiFacebook size="24px" />}
                aria-label="Twitter"
              />
            </Link>
            <Link
              fontWeight="bold"
              target="_blank"
              rel="noreferrer"
              // color="red.100"
              href="https://twitter.com/crazyburgergh"
            >
              <IconButton
                boxShadow={"sm"}
                // colorScheme="ins"
                icon={<FiTwitter size="24px" />}
                aria-label="Facebook"
              />
            </Link>
            {/* <ColorModeToggle /> */}
          </ButtonGroup>
        </Box>
        <Box display="flex" alignItems="center" textAlign="right">
          <Link
            fontWeight="bold"
            target="_blank"
            rel="noreferrer"
            // color="red.100"
            href="https://www.majorlabsgh.com"
          >
            <Image
              src="/major_logo_v5.jpg"
              alt="major labs"
              width={39}
              height={26}
            />
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};
