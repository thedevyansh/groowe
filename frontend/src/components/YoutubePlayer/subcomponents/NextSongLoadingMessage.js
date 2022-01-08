import React from 'react';
import { Flex, Heading, Progress } from '@chakra-ui/react';

function NextSongLoadingMessage() {
  return (
    <Flex
      h='100%'
      flexDir='column'
      textAlign='center'
      alignItems='center'
      justifyContent='center'>
      <Heading>Playing the next song ⏭</Heading>
      <Progress size='xs' isIndeterminate />
    </Flex>
  );
}

export default NextSongLoadingMessage;
