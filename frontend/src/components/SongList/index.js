import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Center } from '@chakra-ui/react';
import { Grid } from 'react-loader-spinner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Song from '../SongCard';
import * as playlistApi from '../../services/playlist';
import { updatePlaylist } from '../../slices/playlistsSlice';

const getRenderItem =
  (selectedPlaylist, list, isInSearch) => (provided, snapshot, rubric) => {
    const song = list[rubric.source.index];

    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={{
          ...provided.draggableProps.style,
          marginBottom: '0.5rem',
        }}>
        <Song
          key={song.id}
          selectedPlaylist={selectedPlaylist}
          data={song}
          isInSearch={isInSearch}
        />
      </div>
    );
  };

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function SongList() {
  const selectedPlaylist =
    useSelector(
      state => state.playlists?.playlists?.[state.playlists?.selectedPlaylist]
    ) ?? {};

  const { status, results } = useSelector(state => state.songSearch);
  const isInSearch = status !== 'idle';
  const list = isInSearch ? results : selectedPlaylist?.queue ?? [];

  const dispatch = useDispatch();
  const renderItem = getRenderItem(selectedPlaylist.id, list, isInSearch);

  const handleOnDragEnd = async result => {
    if (!result.destination || !selectedPlaylist) {
      return;
    }

    const reorderedSongs = reorder(
      selectedPlaylist?.queue ?? [],
      result.source.index,
      result.destination.index
    );

    const newPlaylist = {
      id: selectedPlaylist.id,
      name: selectedPlaylist.name,
      user: selectedPlaylist.user,
      queue: reorderedSongs,
    };

    dispatch(updatePlaylist({ playlist: newPlaylist }));

    const res = await playlistApi.update(newPlaylist.id, newPlaylist);

    if (res.status !== 200) {
      //todo: failed to rearrange playlist
    }
  };

  if (status === 'loading') {
    return (
      <Center h='475px'>
        <Grid color='#90CCF4' height={40} width={40} />
      </Center>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='songList' renderClone={renderItem}>
        {provided => (
          <Box
            className='dark-scrollbar'
            overflow='auto'
            h='475px'
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {list?.map((song, index) => (
              <Draggable
                key={song.id}
                draggableId={song.id}
                index={index}
                isDragDisabled={isInSearch}>
                {renderItem}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default SongList;
