import React from 'react';
import { useSelector } from 'react-redux';
import he from 'he';
import { Link } from 'react-router-dom';
import { FaChevronUp } from 'react-icons/fa';
import {
  HStack,
  IconButton,
  Button,
  Text,
  VStack,
  Tag,
  Flex,
  ButtonGroup,
} from '@chakra-ui/react';
import './index.css';

function LeftSide({ openDrawer }) {
  const authenticated = useSelector(state => state.user.authenticated);
  const { playlists, selectedPlaylist } = useSelector(state => state.playlists);

  if (!authenticated) {
    return (
      <HStack spacing='2rem'>
        <Tag size='lg'>Spectator Mode 👀</Tag>
        <ButtonGroup variant='outline'>
          <Link to='/register'>
            <Button>Register</Button>
          </Link>
          <Link to='/login'>
            <Button>Login</Button>
          </Link>
        </ButtonGroup>
      </HStack>
    );
  }

  return (
    <HStack spacing='2rem' flex='1' justifyContent='start'>
      <IconButton
        variant='outline'
        onClick={openDrawer}
        icon={<FaChevronUp />}
      />
      {selectedPlaylist == null || playlists?.[selectedPlaylist] == null ? (
        <Text>No playlist selected</Text>
      ) : (
        <VStack align='left' spacing={0}>
          <Flex flexWrap='wrap' fontWeight='bold'>
            <Text whiteSpace='nowrap' mr={2}>
              Selected playlist:
            </Text>
            <Flex maxW={{ base: '300px', xl: '300px' }} overflow='hidden'>
              <Text className='marquee' whiteSpace='nowrap'>
                {he.decode(playlists?.[selectedPlaylist]?.name ?? '')}
              </Text>
            </Flex>
          </Flex>
          <Flex flexWrap='wrap'>
            <Text whiteSpace='nowrap' mr={2}>
              Your next song:
            </Text>
            <Flex maxW={{ base: '300px', xl: '300px' }} overflow='hidden'>
              <Text className='marquee' whiteSpace='nowrap'>
                {he.decode(
                  playlists?.[selectedPlaylist]?.queue?.[0]?.title ??
                    'None selected'
                )}
              </Text>
            </Flex>
          </Flex>
        </VStack>
      )}
    </HStack>
  );
}

export default LeftSide;
