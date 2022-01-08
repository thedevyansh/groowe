import React from 'react';
import { Heading, Flex, Image, theme as base } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from './temporalDjLogo.png';

function LeftMenu() {
  return (
    <Flex align='center'>
      <Image src={logo} alt='Temporal.DJ Logo' w='55px' mr={3} />
      <Heading
        as='h1'
        size='md'
        style={{ fontFamily: `${base.fonts?.heading}` }}>
        <Link to='/'>Temporal.DJ</Link>
      </Heading>
    </Flex>
  );
}

export default LeftMenu;
