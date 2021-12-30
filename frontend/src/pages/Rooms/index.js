import React from 'react';
import { useSelector } from 'react-redux';
import {
  Flex,
  Text,
  Button,
  Container,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import CreateRoomModal from '../../components/CreateRoomModal';
import RoomSearch from '../../components/RoomsSearch';
import RoomFilter from '../../components/RoomFilter';
import RoomList from '../../components/RoomList';

function Room({ history }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector(state => state.user);
  const toast = useToast();

  const handleOpenCreateRoom = () => {
    if (user?.authenticated) {
      onOpen();
    } else {
      toast({
        title: 'Please login first',
        status: 'info',
        duration: 2000,
        position: 'top',
      });
      history.push('/login');
    }
  };

  return (
    <>
      <Helmet>
        <title>Public Rooms - Temporal.DJ</title>
      </Helmet>
      <Container maxW='container.xl' p={8} overflow='auto'>
        <Flex spacing={8} justifyContent='space-between' mb={10}>
          <Text fontSize='3xl' fontWeight='semibold' whiteSpace='nowrap'>
            Rooms
          </Text>
          <Button onClick={handleOpenCreateRoom} colorScheme='blue'>
            Create Room
          </Button>
        </Flex>
        <RoomSearch />
        <RoomFilter />
        <RoomList />
      </Container>
      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Room;
