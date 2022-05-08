import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../../../contexts/socket';
import { Button, Flex, Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled';

const ReactionsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  background-color: rgba(12, 22, 45, 0.6);
  padding: 0.3rem;
  border-radius: 8px 0 0 8px;
  margin-bottom: 0.5rem;
`;

function Reactions() {
  const socket = useContext(SocketContext);
  const currentUser = useSelector(state => state.user);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const submit = reaction => {
    return new Promise(resolve => {
      setButtonDisabled(true);
      setTimeout(() => setButtonDisabled(false), 5500);

      socket.emit('reaction', reaction);

      resolve();
    });
  };

  if (!currentUser.authenticated) {
    return null;
  }
  return (
    <Tooltip
      isDisabled={!buttonDisabled}
      hasArrow
      placement='top'
      label='Please wait a few seconds before reacting again.'
      bg='rgba(12, 22, 45, 0.5)'
      color='white'>
      <ReactionsContainer>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('💃')}>
          💃
        </Button>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('🔥')}>
          🔥
        </Button>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('😂')}>
          😂
        </Button>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('❤️')}>
          ❤️
        </Button>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('💩')}>
          💩
        </Button>
        <Button
          isDisabled={buttonDisabled}
          variant='ghost'
          onClick={() => submit('🤮')}>
          🤮
        </Button>
      </ReactionsContainer>
    </Tooltip>
  );
}

export default Reactions;
