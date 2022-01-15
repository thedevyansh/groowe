import { useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { FaChevronCircleDown, FaRegCopy } from 'react-icons/fa';

export default function Simple() {
  const { data } = useSelector(state => state.currentRoom);
  const toast = useToast();

  const handleCopy = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      toast({
        title: 'Copied to clipboard',
        status: 'info',
        duration: '2000',
        position: 'top',
      });

      return navigator.clipboard.writeText(window.location.href);
    }

    toast({
      title: 'Error copying to clipboard',
      status: 'error',
      duration: '2000',
      position: 'top',
    });
  };

  return (
    <>
      <Box bg='rgba(12, 22, 45, 0.5)' px={4}>
        <Flex h={8} alignItems='center' justifyContent='space-between'>
          <Text size='sm' color='gray.400' isTruncated>
            Welcome to {data.name}
          </Text>
          <Menu>
            <MenuButton>
              <FaChevronCircleDown />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaRegCopy />} onClick={handleCopy}>
                Copy room link
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </>
  );
}
