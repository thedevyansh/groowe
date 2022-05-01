import React from 'react';
import { Box, Image, Center } from '@chakra-ui/react';

function FeaturesCard({ imageUrl, imageAlt, feature }) {
  return (
    <Box maxW='xs' p={4}>
      <Center>
        <Image
          src={imageUrl}
          alt={imageAlt}
          height='80px'
        />
      </Center>

      <Box p={4} lineHeight='tight' textAlign='center'>
        {feature}
      </Box>
    </Box>
  );
}

export default FeaturesCard;
