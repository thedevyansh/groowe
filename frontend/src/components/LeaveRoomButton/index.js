import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { TiArrowBack } from 'react-icons/ti';

const btnStyle = {
  backgroundColor: '#FEB2B2',
  color: '#000',
};

function LeaveRoomButton() {
  const history = useHistory();
  const [isLeaveBtnClicked, setIsLeaveBtnClicked] = useState(false);

  const handleLeaveRoom = () => {
    if (isLeaveBtnClicked) {
      history.push('/rooms');
    } else {
      setIsLeaveBtnClicked(true);
    }
  };

  return (
    <Button
      zIndex='1'
      top={4}
      left={4}
      leftIcon={isLeaveBtnClicked ? <TiArrowBack /> : ''}
      variant='solid'
      style={
        isLeaveBtnClicked
          ? btnStyle
          : { backgroundColor: 'var(--chakra-colors-whiteAlpha-300)' }
      }
      onClick={handleLeaveRoom}>
      {!isLeaveBtnClicked ? 'Leave room' : 'Confirm leave'}
    </Button>
  );
}

export default LeaveRoomButton;
