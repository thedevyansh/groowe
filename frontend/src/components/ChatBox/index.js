import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../contexts/socket';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Text,
  Badge,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { IoMdSend } from 'react-icons/io';
import { VscChromeMinimize } from 'react-icons/vsc';
import { FiMaximize2 } from 'react-icons/fi';
import styled from '@emotion/styled';
import MessagesList from './subcomponents/MessageList';
import Reactions from './subcomponents/Reactions';

const BottomRight = styled(Flex)`
  flex-direction: column;
  width: 20%;
  max-width: 345px;
  align-self: flex-end;
  pointer-events: auto;
`;

const ChatContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(12, 22, 45, 0.5);
`;

function ChatBox() {
  const socket = useContext(SocketContext);
  const currentUser = useSelector(state => state.user);
  const initMessages = useSelector(state => state.currentRoom.data.messages);
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm();
  const [messages, setMessages] = useState(initMessages);
  const [isOpen, setIsOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setMessages(initMessages);
  }, [initMessages]);

  useEffect(() => {
    socket.on('chat_message', response => {
      const { message, timeSent, sender } = response;

      setMessages(messages => [
        ...messages,
        {
          id: messages.length + 1,
          sender: sender,
          text: message,
          timeSent: timeSent,
        },
      ]);

      if (!isOpen) {
        setUnreadMessages(prevUnreadMessages => prevUnreadMessages + 1);
      }
    });

    return () => {
      socket.removeAllListeners('chat_message');
    };
  }, [socket, currentUser.username, isOpen, setUnreadMessages]);

  const mySubmit = e => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  const onSubmit = data => {
    const { message } = data;
    return new Promise(resolve => {
      if (message?.trim() !== '') {
        const timeSent = Date.now();
        socket.emit('chat_message', message, timeSent, response => {
          if (response?.success) {
            reset({ message: '' });
          } else {
            toast({
              title: 'Error sending message',
              description: "Couldn't send your message.",
              status: 'error',
              position: 'top-right',
              duration: 1000,
            });
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  const onMinimizeChat = () => {
    setIsOpen(val => !val);

    if (!isOpen && unreadMessages !== 0) {
      setUnreadMessages(0);
    }
  };

  return (
    <BottomRight py='auto' minW='345px'>
      <Reactions />
      <ChatContainer
        height={isOpen ? '480px' : '48px'}
        maxH='480px'
        minW='345px'
        shadow='base'
        borderRadius='8px 0 0 0'>
        <HStack maxH='48px' justifyContent='space-between' px={4} py={2}>
          <HStack spacing={2}>
            <Text fontSize='lg'>Chat</Text>
            {!isOpen && unreadMessages !== 0 ? (
              <Badge variant='solid' colorScheme='red'>
                {unreadMessages}
              </Badge>
            ) : (
              ''
            )}
          </HStack>
          <IconButton
            onClick={onMinimizeChat}
            variant='ghost'
            size='sm'
            icon={
              isOpen ? (
                <VscChromeMinimize size='20px' />
              ) : (
                <FiMaximize2 size='20px' />
              )
            }
          />
        </HStack>

        {isOpen ? (
          <>
            <MessagesList messages={messages} />
            {currentUser.authenticated ? (
              <HStack p='1rem'>
                <Avatar size='xs' src={currentUser.profilePicture} alt='pfp' />
                <form
                  style={{ width: '100%' }}
                  onSubmit={mySubmit}
                  autoComplete='off'>
                  <InputGroup>
                    <Input
                      id='message'
                      type='text'
                      {...register('message')}
                      variant='filled'
                      placeholder='Message room'
                    />
                    <InputRightElement>
                      <IconButton
                        isLoading={isSubmitting}
                        type='submit'
                        variant='ghost'
                        colorScheme='blue'
                        size='md'
                        icon={<IoMdSend size='24px' />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </form>
              </HStack>
            ) : null}
          </>
        ) : null}
      </ChatContainer>
    </BottomRight>
  );
}

export default ChatBox;
