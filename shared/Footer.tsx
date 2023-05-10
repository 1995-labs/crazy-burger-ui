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
  Select,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { Map } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FiFacebook, FiInstagram, FiMapPin, FiTwitter } from "react-icons/fi";
import { useBranch } from "../contexts/BranchContext";
import { charka_dark_color } from "./Header";

export const LocationPopper = () => {
  const ref = useRef(null);
  const {
    branch,
    setBranch,
    loading,
    branches,
    showQuickView,
    setShowQuickView,
  } = useBranch();
  const router = useRouter();

  useOutsideClick({
    ref: ref,
    handler: () => {
      setShowQuickView(false);
    },
  });

  return (
    <Box ref={ref}>
      <Popover isOpen={showQuickView}>
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
          {/* <Button>Trigger</Button> */}
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          {/* <PopoverCloseButton />
        <PopoverHeader>Confirmation!</PopoverHeader> */}
          <PopoverBody p={0}>
            <Flex p={2} justifyContent={"center"}>
              <FiMapPin size="24px" />
              <Text ml={2} fontWeight={"bold"}>
                Change Branch
              </Text>
            </Flex>
            <Divider />
            <Box p={2}>
              <Select
                value={branch?.id}
                isDisabled={branches.length === 1}
                onChange={(e) => {
                  if (e.target.value) {
                    console.log(e.target.value);
                    const newBranch = branches.find(
                      (branch) => branch.id === e.target.value
                    );
                    setBranch(newBranch);
                  }
                  setShowQuickView(false);
                }}
                placeholder="Select option"
              >
                {branches.map((branch) => {
                  return (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  );
                })}
              </Select>
            </Box>
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
    </Box>
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
