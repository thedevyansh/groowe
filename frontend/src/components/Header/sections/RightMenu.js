import React from 'react';
import { Menu, Flex } from '@chakra-ui/react';
import UserIcon from './UserIcon';

function RightMenu() {
  return (
    <Flex alignItems="center">
      <Menu>
        <UserIcon/>
      </Menu>
    </Flex>
  );
}

export default RightMenu;
