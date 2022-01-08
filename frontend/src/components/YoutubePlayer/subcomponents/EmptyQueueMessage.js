import React from 'react';
import { Flex, Text, Heading } from '@chakra-ui/react';

function EmptyQueueMessage() {
  return (
    <Flex
      h="100%"
      flexDir="column"
      textAlign="center"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Nobody is in the queue 😔</Heading>
      <Text>
        Select a playlist and join the queue to get this party started.
      </Text>
    </Flex>
  );
}

export default EmptyQueueMessage;
