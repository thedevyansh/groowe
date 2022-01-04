import React from 'react';
import { Box } from '@chakra-ui/react';

function ErrorContainer({ height, width, borderColor, children }) {
  return (
    <Box
      position='absolute'
      h={`${height}px`}
      w={`${width}px`}
      top='0'
      left='0'
      right='0'
      m='auto'
      bgColor='black'
      borderRadius='0 0 8px 8px'
      border='1px solid'
      borderTop='none'
      borderColor={borderColor}>
      {children}
    </Box>
  );
}

export default ErrorContainer;
