import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, useToast } from '@chakra-ui/react';
import {
  joinQueue,
  leaveQueue,
  enqueue,
  dequeue,
} from '../../slices/queueSlice';
import { SocketContext } from '../../contexts/socket';

function JoinQueueButton() {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const inQueue = useSelector(state => state.queue.inQueue);
  const queueStatus = useSelector(state => state.queue.status);
  const currentUser = useSelector(state => state.user);
  const playlist = useSelector(state => state.playlists);
  const disableJoinQueue =
    !playlist.selectedPlaylist ||
    Object.keys(playlist.playlists).length === 0 ||
    playlist.playlists?.[playlist.selectedPlaylist]?.queue?.length === 0 ||
    queueStatus === 'idle';
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket.on('user_join_queue', (position, userFragment) => {
      if (userFragment.username === currentUser.username) {
        dispatch(joinQueue(currentUser.username));
        setIsLoading(false);
      } else {
        dispatch(enqueue(userFragment.username));
      }
    });

    socket.on('user_leave_queue', username => {
      if (username === currentUser.username) {
        dispatch(leaveQueue(currentUser.username));
        setIsLoading(false);
      } else {
        dispatch(dequeue(username));
      }
    });

    socket.on('dequeued', username => {
      // Sent when user is kicked from the queue
      if (username === currentUser.username) {
        dispatch(leaveQueue(currentUser.username));
        toast({
          title: 'You have been removed from the queue',
          description:
            'Because your selected playlist is empty/deleted or you did not select a playlist.',
          status: 'error',
          duration: 5000,
        });
      } else {
        dispatch(dequeue(username));
      }
    });

    return () => {
      socket.removeAllListeners('user_join_queue');
      socket.removeAllListeners('user_leave_queue');
      socket.removeAllListeners('dequeued');
    };
  }, [socket, dispatch, currentUser, toast]);

  const handleQueue = () => {
    // Artificial timeout
    setIsLoading(true);
    setTimeout(() => {
      if (inQueue) {
        socket.emit('leave_queue');
      } else {
        socket.emit('join_queue');
      }
    }, 100);
  };

  return (
    <Button
      disabled={disableJoinQueue}
      onClick={handleQueue}
      isLoading={isLoading}
      size='md'
      colorScheme='blue'>
      {inQueue ? 'Leave Queue' : 'Join Queue'}
    </Button>
  );
}

export default JoinQueueButton;
