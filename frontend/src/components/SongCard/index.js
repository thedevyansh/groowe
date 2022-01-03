import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Center,
  Flex,
  Text,
  Image,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaPlus, FaTrashAlt, FaYoutube } from 'react-icons/fa';
import he from 'he';
import * as playlistApi from '../../services/playlist';
import { addSong, removeSong } from '../../slices/playlistsSlice';

function Song({ selectedPlaylist, data, isInSearch }) {
  const { title, thumbnails, channelTitle } = data;
  const playlists = useSelector(state => {
    return Object.entries(state.playlists.playlists).map(
      ([_id, playlist]) => playlist
    );
  });
  const dispatch = useDispatch();

  const handleOnClickDelete = async () => {
    if (!selectedPlaylist) {
      return;
    }

    // remove from redux state first for better ux
    dispatch(removeSong({ songId: data.id, playlistId: selectedPlaylist }));

    const res = await playlistApi.removeSong(selectedPlaylist, { id: data.id });

    if (res.status !== 200) {
      // todo: unable to remove song from playlist
    }
  };

  const handleOnClickAdd = async playlist => {
    const res = await playlistApi.addSong(playlist.id, { song: data });

    if (res.status === 200) {
      dispatch(addSong({ song: res.data.song, playlistId: playlist.id }));
    } else {
      // todo: unable to add song
    }
  };

  return (
    <Flex
      bg='#211E1E'
      px={4}
      py={2}
      justify='space-between'
      alignItems='center'
      borderRadius='0.375rem'>
      <Flex alignItems='center'>
        {!isInSearch && (
          <Center>
            <Icon as={GiHamburgerMenu} pr='1rem' boxSize={8} />
          </Center>
        )}
        <Image
          src={thumbnails.default.url}
          w='120px'
          h='90px'
          fallbackSrc='https://via.placeholder.com/120x90'
          alt='thumbnail'
        />
        <Flex ml='4' flexDir='column'>
          <Text>{he.decode(title)}</Text>
          <HStack>
            <Icon as={FaYoutube} />
            <Text>{he.decode(channelTitle)}</Text>
          </HStack>
        </Flex>
      </Flex>

      {isInSearch ? (
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            aria-label='Add to playlist'
            icon={<FaPlus />}
          />
          <MenuList>
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <MenuItem
                  key={index}
                  onClick={async () => await handleOnClickAdd(playlist)}>
                  {playlist.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem isDisabled>No playlists...</MenuItem>
            )}
          </MenuList>
        </Menu>
      ) : (
        <IconButton
          aria-label='Remove song from playlist'
          variant='ghost'
          icon={<FaTrashAlt />}
          colorScheme='red'
          onClick={async () => await handleOnClickDelete()}
        />
      )}
    </Flex>
  );
}

export default Song;
