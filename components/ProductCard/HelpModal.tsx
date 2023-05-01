import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { ClientCatalogItemType } from "../../types/Client";

type Props = { menuItem: ClientCatalogItemType; mobile: boolean };

export const ProductCardHelpModal = ({ menuItem, mobile }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (mobile) {
    return (
      <>
        <IconButton
          width="20%"
          size="md"
          variant="ghost"
          borderRadius="lg"
          // borderBottomLeftRadius="md"
          onClick={onOpen}
          aria-label="more options"
          icon={<DotsHorizontalIcon height="24px" />}
        />

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent m={4}>
            <ModalHeader>{menuItem.name}</ModalHeader>
            <ModalBody>{menuItem.description}</ModalBody>
            <ModalFooter display="flex" justifyContent="center">
              <Button
                width="50%"
                // colorScheme="blue"
                // mr={3}
                // backgroundColor={theme?.colors?.primary}
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <IconButton
        width="25%"
        size="lg"
        variant="link"
        borderRadius="md"
        borderBottomLeftRadius="md"
        onClick={onOpen}
        aria-label="more options"
        icon={<DotsHorizontalIcon height="24px" />}
      />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={4}>
          <ModalHeader>{menuItem.name}</ModalHeader>
          <ModalBody>{menuItem.description}</ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button
              width="50%"
              // colorScheme="blue"
              // mr={3}
              // backgroundColor={theme?.colors?.primary}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
