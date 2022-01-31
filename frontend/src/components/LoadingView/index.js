import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

function LoadingView() {
  return (
    <Center h='65vh'>
      <Spinner
        thickness='4px'
        speed='0.55s'
        emptyColor='gray.200'
        color='blue.300'
        size='xl'
      />
    </Center>
  );
}

export default LoadingView;
