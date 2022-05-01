import React from 'react';
import { Center } from '@chakra-ui/react';
import { Grid } from 'react-loader-spinner';

function LoadingView() {
  return (
    <Center h='65vh'>
      <Grid color='#90CCF4' height={40} width={40} />
    </Center>
  );
}

export default LoadingView;
