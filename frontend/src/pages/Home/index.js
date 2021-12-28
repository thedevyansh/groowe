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
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';

const VerticalHeading = styled.div`
  z-index: -1;
  color: #808080 !important;
  font-weight: 800;
  font-size: 210px;
  line-height: 210px;
  mix-blend-mode: overlay;
  overflow: hidden;
  opacity: 0.1;
  position: fixed;
  left: -20px;
  bottom: -30px;
  padding: 0;
  margin: 0;
  pointer-events: none;
`;

export default function Home({ history, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleOpenCreateRoom = () => {
    if (user?.authenticated) {
      onOpen();
    } else {
      toast({
        title: 'Please login first.',
        status: 'info',
        duration: '5000',
        position: 'top',
        isClosable: true,
      });
      history.push('./login');
    }
  };

  return (
    <>
      <Helmet>
        <title>Temporal.DJ</title>
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
        }}
        color='gray.200'>
        <Heading as='h1' size='4xl'>
          Listen to music with your friends.
        </Heading>
        <Text fontSize='xl' mt='12px'>
          Create a room or join a public room. Make friends through music.
        </Text>
        <ButtonGroup variant='outline' spacing='6' mt='48px'>
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
      <VerticalHeading>TEMPORAL.DJ</VerticalHeading>
    </>
  );
}
