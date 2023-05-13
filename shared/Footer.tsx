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
} from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  FiCheck,
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiTwitter,
} from "react-icons/fi";
import { useBranch } from "../major/internals/BranchContext";
import { charka_dark_color } from "./Header";

export const LocationPopper = () => {
  const ref = useRef(null);
  const [newBranchOption, setNewBranchOption] = useState(null);
  const {
    branch,
    setBranch,
    loading,
    branches,
    showQuickView,
    setShowQuickView,
  } = useBranch();
  // const router = useRouter();

  return (
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
              value={newBranchOption?.id}
              isDisabled={branches.length === 1}
              onChange={(e) => {
                if (e.target.value) {
                  console.log(e.target.value);
                  const newBranch = branches.find(
                    (branch) => branch.id === e.target.value
                  );
                  setNewBranchOption(newBranch);
                } else {
                  setNewBranchOption(branch);
                }

                // setShowQuickView(false);
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
            {/*  */}
            <Button
              boxShadow={"sm"}
              colorScheme="green"
              variant={"solid"}
              isDisabled={!newBranchOption}
              onClick={() => {
                setBranch(newBranchOption);
                setShowQuickView(false);
              }}
              width={"100%"}
              leftIcon={<FiCheck size={"24px"} />}
            >
              Set Branch
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
