import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { search } from '../../slices/songSearchSlice';

function SongSearch() {
  const dispatch = useDispatch();
  const globalQuery = useSelector(state => state.songSearch.query);
  const searchLoading =
    useSelector(state => state.songSearch.status) === 'loading';
  const [localQuery, setLocalQuery] = useState(globalQuery);

  useEffect(() => {
    setLocalQuery(globalQuery);
  }, [globalQuery]);

  const searchSongs = query => {
    dispatch(search(query));
  };

  const handleEnter = e => {
    if (e.key === 'Enter') {
      searchSongs(e.target.value);
    }
  };

  const handleClickSearch = () => {
    searchSongs(localQuery);
  };

  return (
    <InputGroup mb={4}>
      <InputLeftElement
        pointerEvents='none'
        children={<Icon as={FaSearch} color='#8F8F8F' />}
      />
      <Input
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
        onKeyDown={handleEnter}
        placeholder='Search for songs on YouTube...'
        _placeholder={{ color: 'white' }}
      />
      <InputRightElement width='5.5rem'>
        <Button
          isLoading={searchLoading}
          colorScheme='blue'
          h='2rem'
          size='sm'
          onClick={handleClickSearch}>
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default SongSearch;
