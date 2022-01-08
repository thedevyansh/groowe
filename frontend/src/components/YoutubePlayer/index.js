import React, { useEffect, useContext, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../contexts/socket';
import { Box } from '@chakra-ui/react';
import {
  changeVolume,
  reportError,
  clearError,
  playSong,
  endSong,
  stopSong,
  youtubeApiReady,
  updateBoundingBox,
} from '../../slices/youtubeSlice';
import { changeCurrentSong } from '../../slices/queueSlice';
import ErrorBox from './subcomponents/ErrorBox';

let ytStatus = 'unstarted';

function YoutubePlayer({ isAuth, height, width }) {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const player = useRef(null);
  const timesSynced = useRef(0);
  const volume = useSelector(state => state.youtube.volume);
  const song = useSelector(state => state.currentRoom.data.currentSong);
  const isYouTubeApiReady = useSelector(
    state => state.youtube.isYouTubeApiReady
  );

  const onError = useCallback(
    event => {
      const { data } = event;

      dispatch(reportError(data));
    },
    [dispatch]
  );

  const onPlayerStateChange = useCallback(
    event => {
      const { data } = event;

      switch (data) {
        case -1:
          ytStatus = 'unstarted';
          dispatch(clearError());
          break;
        case 0:
          ytStatus = 'stopped';
          dispatch(endSong());
          dispatch(clearError());
          break;
        case 1:
          ytStatus = 'playing';
          dispatch(playSong());
          break;
        case 2:
          ytStatus = 'paused';
          dispatch(clearError());
          break;
        case 3:
          ytStatus = 'buffering';
          dispatch(clearError());
          break;
        case 5:
          ytStatus = 'cued';
          dispatch(clearError());
          break;
        default:
          break;
      }
    },
    [dispatch]
  );

  const onPlayerReady = useCallback(
    event => {
      event.target.playVideo();

      dispatch(changeVolume(50));

      dispatch(
        updateBoundingBox(
          event.target.getIframe().getBoundingClientRect().toJSON()
        )
      );
    },
    [dispatch]
  );

  const createPlayer = useCallback(() => {
    player.current = new window.YT.Player('youtube-player', {
      height: height,
      width: width,
      videoId: song?.videoId,
      playerVars: {
        rel: 0,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        autoplay: 1,
        iv_load_policy: 3,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onError,
      },
    });
  }, [height, width, song, onPlayerReady, onPlayerStateChange, onError]);

  function updateSong(song) {
    if (song?.videoId == null) {
      if (player.current.stopVideo) {
        player.current.stopVideo();
        timesSynced.current = 0;
      }

      return;
    }

    if (player.current.loadVideoById && player.current.playVideo) {
      player.current.loadVideoById(song.videoId);
      player.current.seekTo(0);
      timesSynced.current = 0;
    }
  }

  useEffect(() => {
    // callback for youtube iframe api
    window.onYouTubeIframeAPIReady = () => {
      dispatch(youtubeApiReady());
    };

    // if youtube iframe api was loaded before
    if (isYouTubeApiReady) {
      if (!song) {
        return;
      }

      // create a youtube player if there isn't already one
      if (!player.current) {
        createPlayer();
      } else {
        // reuse the old youtube player
        updateSong(song);
      }

      return;
    }

    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, [isYouTubeApiReady, song, createPlayer, dispatch]);

  // cleanup hook
  useEffect(() => {
    return () => {
      // Destroy player object
      ytStatus = 'unstarted';
      player.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (player.current?.setVolume) {
      player.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    socket.on('sync_song', data => {
      const seekTimeSec = data.seekTime / 1000;

      if (
        (timesSynced.current < 3 || ytStatus !== 'playing') &&
        player.current?.getCurrentTime &&
        Math.abs(player.current.getCurrentTime() - seekTimeSec) > 2
      ) {
        player.current.seekTo(seekTimeSec);
        timesSynced.current++;
      }
    });

    socket.on('stop_song', () => {
      // Sent when current song ends AND there are no more users in queue
      player.current?.pauseVideo();
      timesSynced.current = 0;
      dispatch(stopSong());
      dispatch(changeCurrentSong(null));
    });

    return () => {
      socket.removeAllListeners('sync_song');
      socket.removeAllListeners('stop_song');
    };
  }, [dispatch, player, socket]);

  return (
    <>
      <Box
        position='absolute'
        top='15px'
        left='0'
        right='0'
        m='auto'
        borderRadius='8px'
        id='youtube-player'
      />
      <ErrorBox height={height} width={width} />
    </>
  );
}

export default YoutubePlayer;
