import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heading, Text, Flex } from '@chakra-ui/react';

function index() {
  return (
    <Flex alignItems="center" flexDirection="column" m="15%">
      <Helmet>
        <title>404 - Temporal.DJ</title>
      </Helmet>
      <Heading>404</Heading>
      <Text textAlign='center'>Oops, the page you're trying to reach doesn't exist :(</Text>
    </Flex>
  );
}

export default index;
