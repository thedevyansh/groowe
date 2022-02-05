import React, { useEffect, useContext, useState, useRef } from 'react';
import { SocketContext } from '../../contexts/socket';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, useToast } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import produce from 'immer';
import { AnimatePresence } from 'framer-motion';
import {
  leaveRoom,
  userJoinRoom,
  userLeaveRoom,
  playSong as roomPlaySong,
} from '../../slices/currentRoomSlice';
import { cycleSelectedPlaylist } from '../../slices/playlistsSlice';
import {
  changeCurrentSong,
  reset as resetQueue,
} from '../../slices/queueSlice';
import { reset as resetYoutube, playSong } from '../../slices/youtubeSlice';
import { populate, reset as resetVote } from '../../slices/voteSlice';
import Bubble from '../../components/Bubble';
import ClientBubble from '../../components/ClientBubble';
import LeaveRoomButton from '../../components/LeaveRoomButton';
import YoutubePlayer from '../../components/YoutubePlayer';
import ViewOnlyModal from '../../components/ViewOnlyModal';

function RoomBox(props) {
  const socket = useContext(SocketContext);
  // Handles bubbles for all other members
  const [bubblesData, setBubblesData] = useState({});
  const prevSongPicker = useRef(null);

  // TODO: instead of storing pos in bubblesData,
  // maybe have a separate state for positions?
  const [showViewOnly, setShowViewOnly] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const {
    username: clientUsername,
    profilePicture,
    authenticated,
  } = currentUser;
  const currentRoom = useSelector(state => state.currentRoom);
  const { status, data } = currentRoom;
  const toast = useToast();
  const history = useHistory();
  const roomId = props.roomId;

  const [userReaction, setUserReaction] = useState('');

  useEffect(() => {
    if (status === 'success' && data.members) {
      if (!authenticated) {
        setShowViewOnly(true);
      }
      // Populate bubbles data, but don't add client's bubble
      setBubblesData(
        produce(data.members, draft => {
          delete draft[clientUsername];
        })
      );
      // todo: set video position to current time - data.songStartTime
    } else if (status === 'failed') {
      toast({
        title: 'Error joining room',
        status: 'error',
        duration: 4000,
      });
      history.push('/rooms');
    }
  }, [status, data.members, authenticated, clientUsername, history, toast]);

  useEffect(() => {
    const handlePosChange = (username, newPosition) => {
      if (clientUsername === username) return;

      // TODO: find a better way to update this
      setBubblesData(data =>
        produce(data, draft => {
          if (draft?.[username]?.position)
            draft[username].position = newPosition;
        })
      );
    };

    const handleJoin = (user, position) => {
      const { username, profilePicture } = user;
      dispatch(userJoinRoom());
      toast({
        title: `${username} joined`,
        status: 'info',
        variant: 'top-accent',
        position: 'top-right',
        isClosable: true,
        duration: 3000,
      });
      setBubblesData(data =>
        produce(data, draft => {
          draft[username] = {
            profilePicture: profilePicture,
            prefix: '',
            username: username,
            type: 'other',
            position: position,
            reaction: '',
          };
        })
      );
    };

    const handleLeave = username => {
      dispatch(userLeaveRoom());
      toast({
        title: `${username} left`,
        status: 'error',
        variant: 'top-accent',
        position: 'top-right',
        isClosable: true,
        duration: 3000,
      });
      setBubblesData(data =>
        produce(data, draft => {
          delete draft[username];
        })
      );
    };

    const handleTransferHost = username => {
      toast({
        title: `${username} is the host now!`,
        status: 'warning',
        variant: 'top-accent',
        position: 'top-right',
        isClosable: true,
        duration: 3000,
      });
      // TODO: change bubblesData to reflect host?
    };

    const handleRoomClosed = () => {
      toast({
        title: 'Room closed',
        description: 'The room you were in is now closed',
        status: 'error',
        isClosable: true,
        duration: 20000,
      });
      history.push('/rooms');
    };

    const handleReactions = (username, reaction) => {
      if (clientUsername === username) {
        setUserReaction(reaction);
        setTimeout(() => setUserReaction(''), 5000);
      } else {
        setBubblesData(data =>
          produce(data, draft => {
            if (draft[username]) draft[username].reaction = reaction;
          })
        );
        setTimeout(
          () =>
            setBubblesData(data =>
              produce(data, draft => {
                if (draft[username]) draft[username].reaction = '';
              })
            ),
          5000
        );
      }
    };

    // Listen to user moving
    socket.on('pos_change', (username, position) => {
      handlePosChange(username, position);
    });

    // Listen to user joining room
    socket.on('user_join', response => {
      const { user, position } = response;
      // Don't show own join toast to user
      if (user?.username !== clientUsername) {
        handleJoin(user, position);
      }
    });

    // Listen to user leaving room
    socket.on('user_leave', username => {
      handleLeave(username);
    });

    // Listen to user voting
    socket.on('user_vote', votes => {
      dispatch(populate({ votes, clientUsername }));
    });

    // Listen to new host transfewr
    socket.on('new_host', response => {
      const { username } = response;
      handleTransferHost(username);
    });

    // Listen to room closed
    socket.on('room_closed', () => {
      handleRoomClosed();
    });

    socket.on('play_song', song => {
      const { username: songPicker } = song;

      dispatch(roomPlaySong({ song }));
      dispatch(changeCurrentSong(song));

      if (songPicker === clientUsername) {
        // update redux cycle playlist
        dispatch(cycleSelectedPlaylist());
        setBubblesData(data =>
          produce(data, draft => {
            // Remove prefix from prev songPicker
            if (prevSongPicker.current && draft[prevSongPicker.current]) {
              draft[prevSongPicker.current].type = 'other';
              draft[prevSongPicker.current].prefix = '';
            }
            prevSongPicker.current = songPicker;
          })
        );
      } else {
        // update bubbles data to reflect songpicker
        setBubblesData(data =>
          produce(data, draft => {
            // Remove prefix from prev songPicker
            if (prevSongPicker.current && draft[prevSongPicker.current]) {
              draft[prevSongPicker.current].type = 'other';
              draft[prevSongPicker.current].prefix = '';
            }
            // Set prefix for current songPicker
            if (songPicker && draft[songPicker]) {
              draft[songPicker].type = 'songPicker';
              draft[songPicker].prefix = '🎶';
            }
            prevSongPicker.current = songPicker;
          })
        );
      }

      dispatch(playSong());
      dispatch(resetVote());
    });

    socket.on('reaction', response => {
      handleReactions(response.sender.username, response.message);
    });

    return () => {
      socket.emit('leave_room', response => {
        // console.log('leave_room', response);
      });
      dispatch(leaveRoom());
      dispatch(resetVote());
      dispatch(resetYoutube());
      dispatch(resetQueue());
      socket.removeAllListeners('pos_change');
      socket.removeAllListeners('user_join');
      socket.removeAllListeners('user_leave');
      socket.removeAllListeners('user_vote');
      socket.removeAllListeners('new_host');
      socket.removeAllListeners('room_closed');
      socket.removeAllListeners('play_song');
      socket.removeAllListeners('reaction');
    };
  }, [dispatch, socket, history, toast, roomId, clientUsername]);

  return (
    <Box
      id='canvas'
      position='relative'
      overflow='hidden'
      h='calc(100vh - 80px)'
      w='100%'>
      <Helmet>
        <title>{`${currentRoom?.data?.name} - Temporal.DJ`}</title>
      </Helmet>
      <LeaveRoomButton />
      <YoutubePlayer isAuth={authenticated} height='400' width='680' />
      <AnimatePresence>
        {Object.entries(bubblesData).map(([key, val]) => (
          <Bubble
            key={key}
            profilePicture={val.profilePicture}
            prefix={val.prefix ?? ''}
            username={val.username}
            position={val.position}
            type={val.type}
            reaction={val.reaction !== '' ? val.reaction : null}
          />
        ))}
        <ClientBubble
          isAuth={authenticated}
          roomId={roomId}
          profilePicture={profilePicture}
          prefix='👋'
          username={clientUsername}
          reaction={userReaction !== '' ? userReaction : null}
        />
      </AnimatePresence>
      <ViewOnlyModal
        isOpen={showViewOnly}
        onClose={() => setShowViewOnly(false)}
      />
    </Box>
  );
}

export default RoomBox;
