import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Message from './Message';
import '../index.css';

function MessagesList({ messages, username }) {
  const messagesEnd = useRef({});

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      className='message-scrollbar'
      h='100%'
      w='100%'
      px='1rem'
      pt='0.5rem'
      overflowY='scroll'>
      {messages.map(message => (
        <Message key={message.id} data={message} username={username} />
      ))}
      <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd}></div>
    </Box>
  );
}

export default MessagesList;
