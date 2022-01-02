import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import he from 'he';
import {
  Stack,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Text,
  Icon,
} from '@chakra-ui/react';
import {
  ImVolumeLow,
  ImVolumeMedium,
  ImVolumeHigh,
  ImVolumeMute2,
} from 'react-icons/im';
import { BiBarChart } from 'react-icons/bi';
import { changeVolume, muteVideo } from '../../../slices/youtubeSlice';
import './index.css';

function RightSide() {
  const lastVolumeRef = useRef(50);
  const dispatch = useDispatch();
  const volume = useSelector(state => state.youtube.volume);
  const currentSong = useSelector(state => state.queue.currentSong);

  const handleMute = e => {
    e.preventDefault();
    if (volume === 0) {
      dispatch(changeVolume(lastVolumeRef.current));
    } else {
      lastVolumeRef.current = volume;
      dispatch(muteVideo());
    }
  };

  const handleChangeVolume = value => {
    dispatch(changeVolume(value));
  };

  return (
    <Stack
      direction={{ base: 'column', xl: 'row' }}
      alignItems={{ base: 'center', md: 'flex-end', xl: 'center' }}
      flex='1'
      justifyContent='flex-end'>
      {currentSong != null ? (
        <Flex alignItems='center'>
          <Icon as={BiBarChart} mr={2} />
          <Flex maxW={{ base: '250px', xl: '300px' }} overflow='hidden'>
            <Text
              className='marquee'
              fontWeight='bold'
              whiteSpace='nowrap'
              mr={2}>
              {he.decode(currentSong?.title ?? '')}
            </Text>
          </Flex>
        </Flex>
      ) : null}
      <Flex alignItems='center'>
        <IconButton
          onClick={handleMute}
          variant='ghost'
          mr='1rem'
          icon={
            volume > 70 ? (
              <ImVolumeHigh />
            ) : volume > 25 ? (
              <ImVolumeMedium />
            ) : volume > 0 ? (
              <ImVolumeLow />
            ) : (
              <ImVolumeMute2 />
            )
          }
        />
        <Slider
          aria-label='volume-slider'
          value={volume}
          step={1}
          min={0}
          max={100}
          onChange={handleChangeVolume}
          width={{ base: '5rem', xl: '7rem' }}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
    </Stack>
  );
}

export default RightSide;
