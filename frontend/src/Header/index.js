import React from 'react';
import { Container, Heading, Flex, Image } from '@chakra-ui/react';
import logo from './temporalDjLogo.png';

function Header() {
  return (
    <Container
      d='flex'
      maxW='container.xl'
      justifyContent='space-between'
      position='sticky'
      zIndex='1'
      as='nav'
      alignItems='center'
      flexWrap='wrap'
      padding='1rem'
      color='white'>
      <Flex align='center'>
        <Image src={logo} alt='Temporal.DJ Logo' w='55px' mr={2} />
        <Heading as='h1' size='md'>
          Temporal.DJ
        </Heading>
      </Flex>
    </Container>
  );
}

export default Header;
