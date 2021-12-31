import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { TiArrowBack } from 'react-icons/ti';

function LeaveRoomButton() {
  const history = useHistory();

  const handleLeaveRoom = () => {
    history.push('/rooms');
  };

  return (
    <Button
      zIndex='1'
      top={4}
      left={4}
      leftIcon={<TiArrowBack />}
      variant='solid'
      onClick={handleLeaveRoom}
      bgColor='var(--chakra-colors-whiteAlpha-300)'
      _hover={{
        backgroundColor: 'var(--chakra-colors-whiteAlpha-400)',
      }}>
      Leave room
    </Button>
  );
}

export default LeaveRoomButton;
