import { useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

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
