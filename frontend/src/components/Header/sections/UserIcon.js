import React from 'react';
import { Avatar, MenuButton, HStack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const UserIcon = () => {
  return (
    <HStack spacing={8}>
      <Link to='/login'>
        <Text colorScheme='blue'>Login</Text>
      </Link>
      <Link to='/register'>
        <Text colorScheme='blue'>Register</Text>
      </Link>
    </HStack>
  );
};

export default UserIcon;
