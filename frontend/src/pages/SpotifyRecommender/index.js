import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Text,
  Center,
  Input,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from '@chakra-ui/react';
import $ from 'jquery';

function SpotifyRecommender() {
  useEffect(() => {
    $('.intro-form').hide();
    $('.results').hide();
    // $('#playlist-terms').keyup(function (event) {
    //   if (event.keyCode == 13) {
    //     go();
    //   }
    // });

    // $('#go').on('click', function () {
    //   go();
    // });

    // $('.stop-button').on('click', function () {
    //   abortFetching = true;
    // });

    // $('#fetch-tracks').on('click', function () {
    //   fetchAllTracksFromPlaylist();
    // });

    // $('#login-button').on('click', function () {
    //   loginWithSpotify();
    // });
    // $('#save-button').on('click', function () {
    //   savePlaylist();
    // });

    // $('#norm-for-pop').on('click', function () {
    //   popNormalize = $('#norm-for-pop').is(':checked');
    //   refreshTrackList(allTracks);
    // });
  }, []);

  return (
    <>
      <Helmet>
        <title>Spotify Recommender - GrooWe</title>
      </Helmet>

      <Box id='top' className='jumbotron' p='40px'>
        <Box className='container-fluid' id='jumbo-dialog'>
          <Center>
            <Box id='attitle' fontSize='4xl' fontWeight='bold' m={4}>
              The best DJ is everybody.
            </Box>
          </Center>
          <Center>
            <Text id='ttext' fontSize='18px'>
              The Playlist Miner aggregrates the top tracks from the most
              popular public playlists on Spotify that match your search
              criteria. Looking for the best <i>workout</i> tracks? Enter the
              term <i>workout</i> and we'll find the tracks that have appeared
              most frequently in workout playlists.
            </Text>
          </Center>
          <Box className='intro-form' id='login-form' mt='40px'>
            <Center>
              <Text> To get started, login with your Spotify credentials.</Text>
            </Center>
            <Center>
              <Button
                id='login-button'
                colorScheme='blue'
                size='md'
                fontSize='md'
                mt={4}>
                Login with Spotify
              </Button>
            </Center>
          </Box>

          <Box id='search-form' className='intro-form row' mt='40px'>
            <Box>
              <Input
                id='playlist-terms'
                variant='filled'
                placeholder="'work out' OR workout "
                _placeholder={{ color: 'white' }}
              />
              <Center>
                <Button
                  id='go'
                  colorScheme='blue'
                  size='md'
                  fontSize='md'
                  mt={4}>
                  Find playlists
                </Button>
              </Center>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className='container-fluid work' p='40px'>
        <Box id='info' className='h1 text-center'></Box>

        <Box className='results' id='playlist-table'>
          <Center>
            <Box id='attitle' fontSize='4xl' fontWeight='bold' m={4}>
              Matching Playlists for <span className='keywords'></span>
            </Box>
          </Center>
          ------------ Progress bar here ------------
          <Box className='button-row'>
            <Center>
              <Text>
                We've found
                <span className='total-playlists'> </span> matching playlists
                with a total of <span className='total-tracks'> 0 </span>{' '}
                tracks.
              </Text>
            </Center>
            <Box id='fetch-tracks-ready'>
              <Center>
                <Text>
                  Press
                  <b> Find top tracks </b> to build a playlist of the top tracks
                  across all of these playlists.
                </Text>
              </Center>
              <Box className='obutton-row' m={4}>
                <Center>
                  <Button
                    id='fetch-tracks'
                    colorScheme='blue'
                    size='md'
                    fontSize='md'>
                    Find top tracks
                  </Button>
                </Center>
              </Box>
            </Box>
          </Box>
          <TableContainer>
            <Table
              variant='simple'
              colorScheme='linkedin'
              className='table table-striped table-bordered'>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Playlist name</Th>
                  <Th># of tracks</Th>
                </Tr>
              </Thead>
              <Tbody id='playlist-items'></Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box className='results' id='track-table'>
          <Center>
            <Box fontSize='4xl' fontWeight='bold'>
              <Text id='playlist-name'>
                Top <span className='keywords'> </span> Tracks{' '}
              </Text>
            </Box>
          </Center>
          <Box className='button-row'>
            <Box id='fetching-tracks'>
              <Center>
                <Box>
                  Aggregating <span id='tt-total-tracks'> </span> tracks from
                  all of the <span className='keywords'></span> playlists.
                </Box>
              </Center>
              <Center>
                <Box>
                  You can stop this at any time, but the longer you wait, the
                  better your results.
                </Box>
              </Center>
              <Center>
                <Button
                  id='stop-button'
                  colorScheme='blue'
                  size='md'
                  fontSize='md'
                  m={4}>
                  Stop
                </Button>
              </Center>
            </Box>
            <Box id='ready-to-save'>
              <Center>
                <Box>
                  Here are the top 100 <span className='keywords'></span>{' '}
                  tracks. You can save these as your own Spotify playlist by
                  clicking the button.
                </Box>
              </Center>
              <Center>
                <Button
                  id='save-button'
                  colorScheme='blue'
                  size='md'
                  fontSize='md'
                  mt={4}>
                  Save Playlist to Spotify
                </Button>
              </Center>
            </Box>
          </Box>
          ------------ Progress bar here ------------
          <TableContainer>
            <Table
              variant='simple'
              colorScheme='linkedin'
              className='table table-striped table-bordered'>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Title</Th>
                  <Th>Artist</Th>
                  <Th>Score</Th>
                </Tr>
              </Thead>
              <Tbody id='track-items'></Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}

export default SpotifyRecommender;
