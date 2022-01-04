import React from 'react';
import { useSelector } from 'react-redux';
import ErrorContainer from './ErrorContainer';
import ErrorMessage from './ErrorMessage';
import EmptyQueueMessage from './EmptyQueueMessage';
import NextSongLoadingMessage from './NextSongLoadingMessage';

function ErrorBox({ height, width }) {
  const ytStatus = useSelector(state => state.youtube.status);
  const ytErrorCode = useSelector(state => state.youtube.errorCode);
  const isYouTubeApiReady = useSelector(
    state => state.youtube.isYouTubeApiReady
  );
  const queueState = useSelector(state => state.queue);
  const { currentSong, queue, inQueue, status: queueStatus } = queueState;

  // Show when youtube player encountered error and there are people in queue
  if (
    ytErrorCode != null &&
    queue.length > 0 &&
    !inQueue &&
    !isYouTubeApiReady
  ) {
    return (
      <ErrorContainer width={width} height={height} borderColor='red.500'>
        <ErrorMessage />
      </ErrorContainer>
    );
  }
  // Show when youtube player encountered error and no one in queue
  else if (
    !currentSong &&
    queueStatus === 'success' &&
    (ytStatus === 'stopped' || ytStatus === 'unstarted')
  ) {
    return (
      <ErrorContainer width={width} height={height} borderColor='yellow.500'>
        <EmptyQueueMessage />
      </ErrorContainer>
    );
  }
  // Show when youtube has no error and current song ended and queue not empty
  else if (ytErrorCode === null && ytStatus === 'ended') {
    return (
      <ErrorContainer width={width} height={height} borderColor='blue.500'>
        <NextSongLoadingMessage />
      </ErrorContainer>
    );
  }
  // Show nothing when everything is working
  else {
    return null;
  }
}

export default ErrorBox;
