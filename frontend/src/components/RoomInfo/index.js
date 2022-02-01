import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  HStack,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FaRegCopy, FaUsers } from 'react-icons/fa';
import { SocketContext } from '../../contexts/socket';
import { updateQueue } from '../../slices/queueSlice';
import QueueOrderModal from '../QueueOrderModal';

export default function RoomInfo() {
  const { data } = useSelector(state => state.currentRoom);
  const { username } = useSelector(state => state.user);
  const { queue } = useSelector(state => state.queue);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('update_queue', payload => {
      dispatch(updateQueue(payload));
    });

    return () => {
      socket.removeAllListeners('update_queue');
    };
  }, [socket, dispatch]);

  const handleOpenQueueOrder = () => {
    onOpen();
  };

  const handleCopy = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      toast({
        title: 'Room link copied to clipboard',
        status: 'info',
        duration: '2000',
        position: 'top',
      });

      return navigator.clipboard.writeText(window.location.href);
    }

    toast({
      title: 'Error copying room link to clipboard',
      status: 'error',
      duration: '2000',
      position: 'top',
    });
  };

  return (
    <>
      <Box bg='rgba(12, 22, 45, 0.5)' px={4}>
        <Flex h={8} alignItems='center' justifyContent='space-between'>
          <Text size='sm' color='gray.400' isTruncated>
            Welcome to {data.name}
          </Text>
          <HStack spacing={4}>
            <FaUsers onClick={handleOpenQueueOrder} />
            <FaRegCopy onClick={handleCopy} />
          </HStack>
        </Flex>
      </Box>
      <QueueOrderModal
        isOpen={isOpen}
        onClose={onClose}
        username={username}
        queue={queue}
      />
    </>
  );
}
