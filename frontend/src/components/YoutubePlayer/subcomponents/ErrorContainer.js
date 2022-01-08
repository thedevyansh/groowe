import React from 'react';
import { Box } from '@chakra-ui/react';

function ErrorContainer({ height, width, borderColor, children }) {
  return (
    <Box
      position='absolute'
      h={`${height}px`}
      w={`${width}px`}
      top='15px'
      left='0'
      right='0'
      m='auto'
      bgColor='rgba(12, 22, 45, 0.8)'
      borderRadius='8px'
      border='1px solid'
      borderColor={borderColor}>
      {children}
    </Box>
  );
}

export default ErrorContainer;
