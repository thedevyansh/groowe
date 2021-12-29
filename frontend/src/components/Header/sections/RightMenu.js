import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Flex } from '@chakra-ui/react';
import UserIcon from './UserIcon';
import UserMenu from './UserMenu';

function RightMenu() {
  const { username, status, authenticated, profilePicture } = useSelector(
    state => state.user
  );

  return (
    <Flex alignItems='center'>
      <Menu>
        <UserIcon
          isLoaded={status !== 'idle' && status !== 'loading'}
          isAuth={authenticated}
          image={profilePicture}
        />
        <UserMenu isAuth={authenticated} username={username} />
      </Menu>
    </Flex>
  );
}

export default RightMenu;
