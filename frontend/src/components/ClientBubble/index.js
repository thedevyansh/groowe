import React, { useContext, useEffect, useMemo } from 'react';
import { SocketContext } from '../../contexts/socket';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { joinRoom } from '../../slices/currentRoomSlice';
import { populate as populateQueue } from '../../slices/queueSlice';
import { populate as populateVote } from '../../slices/voteSlice';
import { changeVolumeOnMove } from '../../slices/youtubeSlice';
import throttle from '../../utils/throttle';

function ClientBubble(props) {
  const { isAuth, roomId, profilePicture, username, prefix, reaction } = props;
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const tagColor = 'green';

  const throttledOnDrag = useMemo(
    () =>
      throttle((e, data) => {
        const { x, y } = data;
        dispatch(changeVolumeOnMove({ x, y }));
        socket.emit('pos_change', { x, y });
      }, 50),
    [socket, dispatch]
  );

  useEffect(() => {
    socket.emit('join_room', roomId, response => {
      const { success, room } = response;

      dispatch(joinRoom(response));

      if (success && room) {
        dispatch(
          populateQueue({
            success,
            queue: room.queue,
            currentSong: room.currentSong,
            inQueue: room.queue.findIndex(user => user === username) !== -1,
          })
        );
        dispatch(populateVote({ votes: room.votes, clientUsername: username }));
      }
    });
  }, [socket, dispatch, roomId, username]);

  // Prevents dragging text and images
  const preventDragHandler = e => {
    e.preventDefault();
  };

  if (!isAuth) {
    return null;
  }

  return (
    <Draggable
      onDrag={throttledOnDrag}
      defaultClassName='_draggable'
      defaultClassNameDragging='__dragging'
      defaultClassNameDragged='__dragged'
      bounds='#canvas'>
      <motion.div
        style={{
          position: 'absolute',
          display: 'flex',
          width: '128px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        whileTap={{ opacity: 0.8 }}>
        <Popover
          autoFocus={false}
          isOpen={reaction}
          placement='top'
          arrowSize={10}
          arrowShadowColor='rgba(12, 22, 45, 0.5)'>
          <PopoverTrigger>
            <Avatar
              boxShadow={`0 0 4px 4px ${tagColor}`}
              bgColor={`${tagColor}.500`}
              cursor='move'
              size='lg'
              src={profilePicture}
              name={username}
              onDragStart={preventDragHandler}
            />
          </PopoverTrigger>
          <PopoverContent bg='rgba(12, 22, 45)' maxW='43px'>
            <PopoverArrow bg='#0c162d' />
            <PopoverBody px='10px'>{reaction}</PopoverBody>
          </PopoverContent>
        </Popover>

        <Tag
          mt={4}
          variant='solid'
          colorScheme={tagColor}
          maxW='128px'
          textAlign='center'>
          {`${prefix} ${username.substr(0, 20)}`}
        </Tag>
      </motion.div>
    </Draggable>
  );
}

export default ClientBubble;
