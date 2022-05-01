import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from './grooweLogo.png'

function LeftMenu() {
  return (
    <Flex align='center'>
      <Image src={logo} alt='GrooWe Logo' w='45px' mr={2} />
      <Text fontSize='2xl'>
        <Link to='/'>GrooWe</Link>
      </Text>
    </Flex>
  );
}

export default LeftMenu;
