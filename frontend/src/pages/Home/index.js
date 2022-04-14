import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Heading,
  Text,
  ButtonGroup,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import CreateRoomModal from '../../components/CreateRoomModal';
import { HorizontalHeading } from '../../horizontalHeading';

export default function Home({ history, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleOpenCreateRoom = () => {
    if (user?.authenticated) {
      onOpen();
    } else {
      toast({
        title: 'Please login first',
        status: 'info',
        duration: '2000',
        position: 'top',
      });
      history.push('./login');
    }
  };

  return (
    <>
      <Helmet>
        <title>GrooWe</title>
      </Helmet>
      <Container
        h='calc(100vh - 72px)'
        d='flex'
        justifyContent='center'
        flexDir='column'
        maxW={{
          base: 'container.sm',
          sm: 'container.sm',
          md: 'container.md',
          lg: 'container.lg',
          xl: 'container.xl',
        }}>
        <Heading as='h1' size='4xl'>
          Rock your party with the DJ.
        </Heading>
        <Text fontSize='xl' mt='16px'>
          Create a room or join a public room. Make friends through music.
        </Text>
        <ButtonGroup variant='outline' spacing='4' mt='50px'>
          <Link to='/rooms'>
            <Button colorScheme='blue' variant='solid' size='lg'>
              View Rooms
            </Button>
          </Link>
          <Button size='lg' onClick={handleOpenCreateRoom}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Container>
      <HorizontalHeading>GROOWE</HorizontalHeading>
      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
