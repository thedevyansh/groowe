import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get, getMore, reset } from '../../slices/roomsSlice';
import { SimpleGrid, Text } from '@chakra-ui/react';
import LoadingView from '../LoadingView';
import RoomCard from '../RoomCard';

function RoomList() {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms);
  const { data, searchQuery, limit, filters, status, hasMore, getMoreStatus } =
    rooms;

  useEffect(() => {
    const onScrollBottom = () => {
      if (hasMore && status === 'success' && getMoreStatus !== 'loading') {
        dispatch(
          getMore({
            searchQuery: searchQuery,
            limit: limit,
            skip: data.length,
            filters: filters,
          })
        );
      }
    };

    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        onScrollBottom();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    data,
    status,
    getMoreStatus,
    dispatch,
    filters,
    hasMore,
    limit,
    searchQuery,
  ]);

  useEffect(() => {
    dispatch(reset());
    // Initial get 20 rooms
    dispatch(
      get({
        searchQuery: '*',
        limit: 20,
        skip: 0,
        filters: [],
      })
    );
  }, [dispatch]);

  if (rooms?.status === 'idle' || rooms?.status === 'loading') {
    return <LoadingView />;
  } else if (data?.length === 0) {
    return <Text fontSize='xl' fontWeight='semibold'>No rooms found.</Text>;
  } else {
    return (
      <>
        <SimpleGrid id='scrollable' minChildWidth='364px' spacing={6}>
          {data?.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </SimpleGrid>

        {getMoreStatus === 'loading' && <LoadingView />}
      </>
    );
  }
}

export default RoomList;
