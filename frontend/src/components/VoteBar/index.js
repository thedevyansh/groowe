import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';

function VoteBar() {
  const votes = useSelector(state => state.vote);
  const numMembers = useSelector(state => state.currentRoom.data.numMembers);
  const currentSong = useSelector(state => state.queue.currentSong);
  const totalVotes = votes.likes + votes.dislikes;
  const likePercentage = (votes.likes / numMembers) * 100;
  const dislikePercentage = (votes.dislikes / numMembers) * 100;
  const numDislikesToSkip = Math.ceil(numMembers / 2);
  const tooltipLabel =
    numDislikesToSkip - votes.dislikes <= 0
      ? 'Skipping song...'
      : `${numDislikesToSkip - votes.dislikes} more dislikes to skip`;

  if (!votes || totalVotes === 0 || !currentSong) {
    return null;
  }

  return (
    <Flex w='100%' position='absolute' top='0' h='3px' overflow='hidden'>
      <motion.div
        style={{
          position: 'absolute',
          left: '-100%',
          display: 'flex',
          height: '3px',
          width: '100%',
          backgroundColor: 'var(--chakra-colors-blue-300)',
          boxShadow: '0 0 20px 3px var(--chakra-colors-blue-300)',
        }}
        animate={{ x: `${likePercentage}%` }}
      />
      {votes.dislikes > 0 ? (
        <>
          <Tooltip
            placement='bottom'
            label={tooltipLabel}
            hasArrow
            isOpen={votes.dislikes / numDislikesToSkip >= 0.3}>
            <Flex
              position='absolute'
              w={`${dislikePercentage}%`}
              h='3px'
              ml='auto'
              right='0'
              opacity='0'
            />
          </Tooltip>
          <motion.div
            style={{
              position: 'absolute',
              right: '-100%',
              display: 'flex',
              height: '3px',
              width: '100%',
              marginLeft: 'auto',
              backgroundColor: 'var(--chakra-colors-gray-500)',
              boxShadow: '0 0 20px 3px var(--chakra-colors-gray-500)',
            }}
            animate={{ x: `-${dislikePercentage}%` }}
          />
        </>
      ) : null}
    </Flex>
  );
}

export default VoteBar;
