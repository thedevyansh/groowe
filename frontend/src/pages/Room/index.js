import React from 'react';
import { Global, css } from '@emotion/react';
import RoomInfo from '../../components/RoomInfo';
import RoomBox from '../../components/RoomBox';
import SongBar from '../../components/SongBar';
import VoteBar from '../../components/VoteBar';

function Room({ match }) {
  const roomId = match.params.id;

  return (
    <>
      <Global
        styles={css`
          html {
            height: 100%;
          }
        `}
      />
      <RoomInfo />
      <RoomBox roomId={roomId} />
      <SongBar />
      <VoteBar />
    </>
  );
}

export default Room;
