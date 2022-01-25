import React from 'react';
import { Center } from '@chakra-ui/react';
import { BallTriangle } from 'react-loader-spinner';

function LoadingView() {
  return (
    <Center h='65vh'>
      <BallTriangle
        color='#90CCF4'
        ariaLabel='loading...'
        height={60}
        width={60}
      />
    </Center>
  );
}

export default LoadingView;
