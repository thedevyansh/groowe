import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  HStack,
  Avatar,
  AvatarBadge,
} from '@chakra-ui/react';

function QueueOrderModal({ isOpen, onClose, username, queue }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalOverlay />
      <ModalContent bg='gray.900'>
        {queue.length === 0 && (
          <>
            <ModalHeader>No one is in the queue.</ModalHeader>
            <ModalCloseButton />
          </>
        )}
        {queue.length !== 0 && (
          <>
            <ModalHeader>Friends in queue</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>Next track by</Text>
              <List spacing={4}>
                {queue.map((user, index) => {
                  return (
                    <ListItem key={index}>
                      <HStack spacing={4}>
                        <Avatar size='xs'>
                          <AvatarBadge boxSize='1em' bg='green.500' />
                        </Avatar>
                        <Text>{user === username ? 'You' : user}</Text>
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default QueueOrderModal;
