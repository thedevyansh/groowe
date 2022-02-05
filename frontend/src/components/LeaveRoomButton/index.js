import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { TiArrowBack } from 'react-icons/ti';

function LeaveRoomButton() {
  const history = useHistory();

  const handleLeaveRoom = () => {
    history.push('/rooms');
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        zIndex='1'
        top={4}
        left={4}
        leftIcon={<TiArrowBack />}
        variant='solid'
        bgColor='var(--chakra-colors-whiteAlpha-300)'
        _hover={{
          backgroundColor: 'var(--chakra-colors-whiteAlpha-400)',
        }}>
        Leave room
      </MenuButton>
      <MenuList bgColor='#FEB2B2' color='black'>
        <MenuItem fontWeight='bold' onClick={handleLeaveRoom}>
          Confirm Leave
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default LeaveRoomButton;
