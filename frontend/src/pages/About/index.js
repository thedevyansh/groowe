import React from 'react';
import {
  Container,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Center,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import FeaturesCard from '../../components/FeaturesCard';
import { HorizontalHeading } from '../../horizontalHeading';
import musicLogo from './images/musicLogo.png';
import playlistLogo from './images/playlistLogo.png';
import messagingLogo from './images/messagingLogo.png';
import queueLogo from './images/queueLogo.png';

export default function About() {
  return (
    <>
      <Helmet>
        <title>GrooWe</title>
      </Helmet>
      <Container
        mt='20px'
        mb='30px'
        maxW={{
          base: 'container.sm',
          sm: 'container.sm',
          md: 'container.md',
          lg: 'container.lg',
          xl: 'container.xl',
        }}
        centerContent>
        <Text fontSize='5xl' fontWeight='bold' mb={4}>
          GrooWe
        </Text>
        <VStack spacing={10}>
          <Box borderWidth='1px' borderRadius='lg' p={4}>
            <Center>
              <Badge borderRadius='full' px='2'>
                Groove on music together!
              </Badge>
            </Center>
            It's important to interact and have fun with friends to stay sane.
            With technology changing the way we conduct communication, GrooWe is
            a platform that allows music lovers to explore new music and listen
            to their favorite songs with their buddies in virtual spaces called
            <i> rooms</i>.
          </Box>

          <Text fontSize='3xl' fontWeight='bold'>
            Main Features.
          </Text>

          <HStack wrap='wrap' justify='center'>
            <FeaturesCard
              imageUrl={musicLogo}
              imageAlt='Music logo'
              feature='Listen to the same songs with your buddies simultaneously.'
            />
            <FeaturesCard
              imageUrl={playlistLogo}
              imageAlt='Playlist logo'
              feature='Create playlists based on genre and change order of songs.'
            />
            <FeaturesCard
              imageUrl={messagingLogo}
              imageAlt='Messaging logo'
              feature='Interact through instant messaging, proximity audio, reactions, and voting.'
            />
            <FeaturesCard
              imageUrl={queueLogo}
              imageAlt='Queue logo'
              feature="A fair-queue mechanism that ensures everyone's song choices get played."
            />
          </HStack>

          <Box borderWidth='1px' borderRadius='lg' p={4}>
            <Text fontSize='2xl' fontWeight='bold'>
              Rooms.
            </Text>

            <Box>
              Users can create rooms where others can join. A room is a place
              where multiple people can listen to the same songs together at the
              same time. Public rooms can be searched and joined. Private rooms
              aren't searchable, and others will have to be invited individually
              to them.
            </Box>
          </Box>

          <Box borderWidth='1px' borderRadius='lg' p={4}>
            <Text fontSize='2xl' fontWeight='bold'>
              Playlists.
            </Text>

            <Box>
              A playlist is a collection of songs. Songs are played through
              playlists created by users. Users can freely add/or remove songs
              from their playlists and rearrange the order of their songs.
              Playlists help facilitate the <i>queue mechanism</i> of GrooWe.
            </Box>
          </Box>

          <Box borderWidth='1px' borderRadius='lg' p={4}>
            <Text fontSize='2xl' fontWeight='bold'>
              Queue Mechanism.
            </Text>

            <Box>
              Users can join the queue in the room to play the songs in their
              selected playlist.{' '}
              <b>
                The order in which users join the queue determines the order in
                which songs are played.
              </b>{' '}
              The first song in their selected playlist is played for each user.
              Then the first song is cycled to the back of the playlist. Thus,
              each user in the queue is guaranteed to have one of their songs
              played, and playlists of any size will continue playing until the
              user leaves the queue.
            </Box>
          </Box>

          <Box borderWidth='1px' borderRadius='lg' p={4}>
            <Text fontSize='2xl' fontWeight='bold'>
              Voting.
            </Text>

            <Box>
              Users can like or dislike the current song. If at least half of
              the people in the room dislike the music, it will be skipped.
              Voting for the song is the only way the current playing song can
              be skipped apart from when the song ends.
            </Box>
          </Box>
        </VStack>
      </Container>
      <HorizontalHeading>GrooWeGrooWe</HorizontalHeading>
    </>
  );
}
