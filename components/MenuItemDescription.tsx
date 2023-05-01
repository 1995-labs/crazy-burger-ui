import { Box } from "@chakra-ui/layout";
import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import { ClientCatalogItemType } from "../types/Client";

export const MenuItemDescription = ({
  menuItem,
}: {
  menuItem: ClientCatalogItemType;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box position="absolute" bottom={0} right={0} m={2}>
      <Tooltip label={`Click for more information on ${menuItem.name}`}>
        <IconButton
          variant="ghost"
          size="xs"
          _hover={{
            backgroundColor: "none",
          }}
          _active={{
            backgroundColor: "none",
          }}
          aria-label="remove from cart"
          onClick={onOpen}
          icon={<FiHelpCircle color="white" size="24px" />}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{menuItem.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{menuItem.description}</ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
