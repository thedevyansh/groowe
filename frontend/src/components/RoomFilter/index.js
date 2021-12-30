import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { get } from '../../slices/roomsSlice';
import { Text, Button, HStack } from '@chakra-ui/react';

const genres = [
  'EDM',
  'Rock',
  'Country',
  'Pop',
  'Hip hop',
  'R&B',
  'Jazz',
  'Indie',
];

function RoomFilter() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const dispatch = useDispatch();
  const firstLoad = useRef(true);

  const selectFilter = key => {
    const isSelected = selectedFilters.includes(key);
    if (isSelected) {
      setSelectedFilters(filters => filters.filter(f => f !== key));
    } else {
      setSelectedFilters(filters => [...filters, key]);
    }
  };

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      dispatch(
        get({
          skip: 0,
          limit: 20,
          filters: selectedFilters,
        })
      );
    }
  }, [selectedFilters, dispatch]);

  return (
    <HStack my={4} spacing={4}>
      <Text>Filter:</Text>
      <HStack wrap='wrap'>
        {genres.map((genre, index) => {
          const isSelected = selectedFilters.includes(genre);
          return (
            <Button
              key={index}
              onClick={() => selectFilter(genre)}
              colorScheme={isSelected ? 'blue' : 'gray'}
              variant='solid'
              size='sm'>
              {genre}
            </Button>
          );
        })}
      </HStack>
    </HStack>
  );
}

export default RoomFilter;
