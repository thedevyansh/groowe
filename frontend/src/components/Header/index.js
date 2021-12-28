import React from 'react';
import LeftMenu from './sections/LeftMenu';
import RightMenu from './sections/RightMenu';
import { Container } from '@chakra-ui/react';

function Header() {
  return (
    <Container
      d="flex"
      maxW="container.xl"
      justifyContent="space-between"
      position="sticky"
      zIndex="1"
      as="nav"
      alignItems="center"
      flexWrap="wrap"
      padding="1rem"
      color="white"
    >
      <LeftMenu />
      <RightMenu />
    </Container>
  );
}

export default Header;
