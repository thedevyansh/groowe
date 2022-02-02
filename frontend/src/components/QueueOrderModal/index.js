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
  Divider,
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
              <Text mb={3} style={{ fontWeight: 'bold' }}>
                Next track by
              </Text>
              <HStack spacing={2} mb={4}>
                <Text>🎧</Text>
                <Text>{queue[0] === username ? 'You' : queue[0]}</Text>
              </HStack>

              {queue.length > 1 && (
                <>
                  <Divider />
                  <Text mt={3} mb={3} style={{ fontWeight: 'bold' }}>
                    Later
                  </Text>
                </>
              )}
              <List spacing={4}>
                {queue.map((user, index) => {
                  if (index !== 0) {
                    return (
                      <ListItem key={index}>
                        <HStack spacing={2}>
                          <Text>🎧</Text>
                          <Text>{user === username ? 'You' : user}</Text>
                        </HStack>
                      </ListItem>
                    );
                  }
                  return null;
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
