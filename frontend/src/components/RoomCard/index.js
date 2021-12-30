import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flex,
  Text,
  Tag,
  TagLabel,
  TagRightIcon,
  HStack,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import he from 'he';
import { BiBarChart } from 'react-icons/bi';
import { MdGroup } from 'react-icons/md';
import './marquee.css';

function RoomCard(props) {
  const { room } = props;

  return (
    <Link to={`/room/${room.id}`}>
      <Flex
        cursor='pointer'
        flexDir='column'
        bgColor='rgba(12, 15, 49, 0.4)'
        border='1px solid #2A3448'
        transition='.2s all'
        _hover={{
          opacity: 0.8,
        }}
        borderRadius='8px'
        padding='1rem 1.5rem 1.5rem 1.5rem'
        maxH='265px'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text
            fontSize='2xl'
            fontWeight='semibold'
            whiteSpace='nowrap'
            textOverflow='ellipsis'
            overflow='hidden'>
            {room.name}
          </Text>
          <Tag colorScheme='blue' h={2}>
            <TagRightIcon as={MdGroup} />
            <TagLabel ml={2}>{room.numMembers}</TagLabel>
          </Tag>
        </Flex>
        <HStack mt={1}>
          <Icon as={BiBarChart} />
          <Flex overflow='hidden'>
            <Text className='marquee' fontSize='sm' color='gray.100' whiteSpace='nowrap'>
              {he.decode(room.currentSong?.title ?? 'Unknown song')}
            </Text>
          </Flex>
        </HStack>
        <Text
          color='#AFB5CA'
          fontWeight='light'
          maxH='4.5em'
          lineHeight='1.5em'
          wordBreak='break-word'
          textOverflow='ellipsis'
          overflow='hidden'
          my={2}>
          {room.description}
        </Text>
        <HStack mt={3}>
          <Avatar size='xs' src={room.host.profilePicture} alt='Host avatar' />
          <Text color='white' mx='2' my='6'>
            {room.host.username}
          </Text>
          {room.genres.map(genre => {
            return <Tag key={genre}>{genre}</Tag>;
          })}
        </HStack>
      </Flex>
    </Link>
  );
}

export default RoomCard;
