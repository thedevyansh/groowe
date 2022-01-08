import React from 'react';
import { Flex, Text, Heading } from '@chakra-ui/react';

function ErrorMessage() {
  return (
    <Flex
      h='100%'
      flexDir='column'
      textAlign='center'
      alignItems='center'
      justifyContent='center'>
      <Heading>An error occured 🤯</Heading>
      <Text>Please refresh the page or select a different song/playlist.</Text>
    </Flex>
  );
}

export default ErrorMessage;
