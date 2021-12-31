import React from 'react';
import { Avatar, Flex, Text } from '@chakra-ui/react';

function Message({ data }) {
  return (
    <Flex pb='1rem' w='100%'>
      <Avatar size='xs' src={data.sender.profilePicture} alt='pfp' />
      <Text fontSize='sm' pl='0.5rem' w='100%' wordBreak='break-word'>
        <b>{data.sender.username}: </b>
        {data.text}
      </Text>
    </Flex>
  );
}

export default Message;
