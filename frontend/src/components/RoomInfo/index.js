import { useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';

export default function Simple() {
  const { data } = useSelector(state => state.currentRoom);
  return (
    <>
      <Box bg='rgba(12, 22, 45, 0.5)' px={4}>
        <Flex h={8} alignItems={'center'} justifyContent={'center'}>
          <Text size='sm' color='gray.400' isTruncated>
            Welcome to {data.name}
          </Text>
        </Flex>
      </Box>
    </>
  );
}
