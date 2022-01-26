import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heading, Text, Flex, Button, useDisclosure } from '@chakra-ui/react';
import { HorizontalHeading } from '../horizontalHeading';
import SendMessageModal from '../SendMessageModal';

function MaintenancePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex alignItems='center' flexDirection='column' m='15%'>
        <Helmet>
          <title>Temporal.DJ</title>
        </Helmet>
        <Heading>Oh hi there! 👋</Heading>
        <Text textAlign='center' mt={2} mb={4}>
          Temporal.DJ is shy enough to show up every time. Shoot us a message,
          and we'll bring it back
          to you in no time :)
        </Text>
        <Button
          colorScheme='blue'
          variant='solid'
          size='md'
          mt={4}
          onClick={() => onOpen()}>
          Send the message
        </Button>
        <HorizontalHeading>TEMPORAL.DJ</HorizontalHeading>
      </Flex>
      <SendMessageModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default MaintenancePage;
