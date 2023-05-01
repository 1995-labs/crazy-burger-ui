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
  useColorModeValue,
} from "@chakra-ui/react";
import { Map } from "lucide-react";
import { useRouter } from "next/router";
import { FiFacebook, FiInstagram, FiMapPin, FiTwitter } from "react-icons/fi";
import { useBranch } from "../contexts/BranchContext";
import { charka_dark_color } from "./Header";

const LocationPopper = () => {
  const { branch, setBranch, loading, branches } = useBranch();
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          isLoading={loading}
          icon={<FiMapPin size="24px" />}
          aria-label="Map"
          boxShadow={"sm"}
        />
        {/* <Button>Trigger</Button> */}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        {/* <PopoverCloseButton />
        <PopoverHeader>Confirmation!</PopoverHeader> */}
        <PopoverBody p={0}>
          <Box p={2}>
            <Select
              value={branch?.id}
              isDisabled={branches.length === 1}
              onChange={(e) =>
                setBranch(
                  branches.find((branch) => branch.id === e.target.value)
                )
              }
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
              href="https://www.instagram.com/thewingmangh"
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
              href="https://www.facebook.com/thewingmangh/"
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
              href="https://twitter.com/thewingmangh"
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
            MAJOR
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};
