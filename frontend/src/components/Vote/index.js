import React, { useContext, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Flex,
  IconButton,
  Text,
  HStack,
  VStack,
  useToast,
  SlideFade,
} from '@chakra-ui/react';
import { IoMdThumbsUp, IoMdThumbsDown } from 'react-icons/io';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import styled from '@emotion/styled';
import { SocketContext } from '../../contexts/socket';
import { addSong } from '../../slices/playlistsSlice';
import { clientLike, clientSave, clientDislike } from '../../slices/voteSlice';
import { addSong as saveToPlaylist } from '../../services/playlist';
import throttle from '../../utils/throttle';

const BottomLeft = styled(Flex)`
  flex-direction: column;
  align-self: flex-start;
  margin-top: auto;
  pointer-events: auto;
`;

function Vote() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const toast = useToast();
  const authenticated = useSelector(state => state.user.authenticated);
  const currentSong = useSelector(state => state.queue.currentSong);
  const selectedPlaylistId = useSelector(
    state => state.playlists.selectedPlaylist
  );
  const { clientVote, clientSaved, likes, dislikes } = useSelector(
    state => state.vote
  );
  const [saveSongLoading, setSaveSongLoading] = useState(false);

  const like = () => {
    socket.emit('vote', 'like');
    dispatch(clientLike());
  };

  const saveSong = async () => {
    setSaveSongLoading(true);
    const res = await saveToPlaylist(selectedPlaylistId, {
      song: currentSong,
    });

    if (res.status === 200 && res.data.success) {
      dispatch(
        addSong({ playlistId: selectedPlaylistId, song: res.data.song })
      );
      dispatch(clientSave());
    } else {
      toast({
        title: 'Error saving song',
        description: "Song couldn't be saved. Please try again.",
        status: 'error',
        position: 'top-right',
        duration: 2000,
      });
    }
    setSaveSongLoading(false);
  };

  const dislike = () => {
    socket.emit('vote', 'dislike');
    dispatch(clientDislike());
  };

  const likeSong = useRef(throttle(like, 250));
  const dislikeSong = useRef(throttle(dislike, 250));

  if (!currentSong || !authenticated) return <div></div>;

  return (
    <BottomLeft>
      <HStack alignItems='flex-end' m={4}>
        <VStack>
          <Text>{likes}</Text>
          <IconButton
            size='lg'
            onClick={likeSong.current}
            colorScheme={clientVote === 'like' ? 'blue' : 'gray'}
            aria-label='Like this song'
            icon={<IoMdThumbsUp />}
          />
        </VStack>
        <VStack>
          <SlideFade in={clientSaved}>
            <Text>{clientSaved ? '★' : ''}</Text>
          </SlideFade>
          <IconButton
            size='lg'
            disabled={selectedPlaylistId == null || clientSaved}
            isLoading={saveSongLoading}
            onClick={saveSong}
            aria-label='Save this song'
            icon={clientSaved ? <AiFillStar /> : <AiOutlineStar />}
          />
        </VStack>
        <VStack>
          <Text>{dislikes}</Text>
          <IconButton
            size='lg'
            onClick={dislikeSong.current}
            colorScheme={clientVote === 'dislike' ? 'blue' : 'gray'}
            aria-label='Dislike this song'
            icon={<IoMdThumbsDown />}
          />
        </VStack>
      </HStack>
    </BottomLeft>
  );
}

export default Vote;
