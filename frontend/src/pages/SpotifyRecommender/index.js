import React, { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Text,
  Center,
  FormControl,
  FormLabel,
  Input,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import $ from 'jquery';
import _, { map } from 'underscore';

function SpotifyRecommender() {
  let maxPlaylists = 10;
  let maxPlaylistsToDisplay = 10;
  let credentials = null;

  let totalTracks = 0;
  let totalPlaylistCount = 0;

  let abortFetching = false;
  let popNormalize = false;

  let allPlaylists = [];
  let topTracks = null;
  let allTracks = {};

  function error(s) {
    info(s);
  }

  function info(s) {
    $('#info').text(s);
  }

  function getTime() {
    return Math.round(new Date().getTime() / 1000);
  }

  function callSpotify(url, data) {
    return $.ajax(url, {
      dataType: 'json',
      data: data,
      headers: {
        Authorization: 'Bearer ' + credentials.token,
      },
    });
  }

  function findMatchingPlaylists(text) {
    let outstanding = 0;

    function addItem(tbody, which, item) {
      let tr = $('<Tr>');
      let rowNumber = $('<Td>').text(which);
      let title = $('<Td>').text(item.name);
      let tracks = $('<Td>').text(item.tracks.total);

      tr.append(rowNumber);
      tr.append(title);
      tr.append(tracks);
      $('#playlist-item').append(tr);
      tbody.append(tr);
    }

    function showSearchResults(data) {
      outstanding--;

      var matching =
        data.playlists.total > maxPlaylists
          ? '>' + maxPlaylists
          : data.playlists.total;
      $('#matching').text(matching);
      var tbody = $('#playlist-items');
      _.each(data.playlists.items, function (item, which) {
        if (true || !item.collaborative) {
          if (allPlaylists.length < maxPlaylistsToDisplay) {
            addItem(tbody, data.playlists.offset + which + 1, item);
          }
          if (allPlaylists.length < maxPlaylists) {
            allPlaylists.push([item.owner.id, item.id]);
            totalTracks += item.tracks.total;
          }
        } else {
        }
      });

      let totalPlaylists = allPlaylists.length;
      let total = Math.min(data.playlists.total, maxPlaylists);
      // let percentComplete = Math.round((totalPlaylists * 100) / total);

      $('.total-tracks').text(totalTracks);
      $('.total-playlists').text(totalPlaylists);
      // $('#playlist-progress').css('width', percentComplete + '%');

      if (abortFetching || outstanding == 0) {
        abortFetching = false;
        if (totalPlaylists > 0) {
          $('#fetch-tracks-ready').show(200);
        } else {
          info('No matching playlists found');
          $('#fetch-tracks-ready').show(200);
        }
      }
    }

    function processPlaylistError() {
      outstanding--;
      error("Can't get playlists");
    }

    function processPlaylists(data) {
      let total = Math.min(data.playlists.total, maxPlaylists);
      let offset = data.playlists.offset + data.playlists.items.length;
      for (let i = offset; i < total; i += 50) {
        let url = 'https://api.spotify.com/v1/search';
        let params = {
          q: text,
          type: 'playlist',
          limit: data.playlists.limit,
          offset: i,
        };
        outstanding++;
        callSpotify(url, params).then(showSearchResults, processPlaylistError);
      }
      showSearchResults(data);
    }

    totalTracks = 0;
    abortFetching = false;
    allPlaylists = [];
    $('#fetch-tracks-ready').hide();

    let url = 'https://api.spotify.com/v1/search';
    let params = {
      q: text,
      type: 'playlist',
      limit: 50,
    };
    let offset = 0;
    $('#playlist-items').empty();
    outstanding++;
    callSpotify(url, params).then(processPlaylists, processPlaylistError);
  }

  function go() {
    $('#top').hide(200);
    let text = $('#playlist-terms').val();
    if (text.length > 0) {
      info('');
      $('.keywords').text(text);
      $('.results').hide();
      $('#playlist-table').show();
      findMatchingPlaylists(text);
    } else {
      info('Enter some keywords first.');
    }
  }

  function initApp() {
    $('.intro-form').hide();
    $('.results').hide();

    $('#playlist-terms').keyup(function (event) {
      if (event.keyCode == 13) {
        go();
      }
    });

    $('#go').on('click', function () {
      go();
    });

    // $('.stop-button').on('click', function () {
    //   abortFetching = true;
    // });

    // $('#fetch-tracks').on('click', function () {
    //   fetchAllTracksFromPlaylist();
    // });

    $('#login-button').on('click', function () {
      loginWithSpotify();
    });

    // $('#save-button').on('click', function () {
    //   savePlaylist();
    // });

    // $('#norm-for-pop').on('click', function () {
    //   popNormalize = $('#norm-for-pop').is(':checked');
    //   refreshTrackList(allTracks);
    // });
  }

  function loginWithSpotify() {
    let client_id = '516f835b0b6e4aef8881a568bfd47fdc';
    let redirect_uri = 'https://groowe.netlify.app/spotify-recommender/';
    let scopes = 'playlist-modify-public';

    if (document.location.hostname == 'localhost') {
      redirect_uri = 'http://localhost:3000/spotify-recommender/';
    }

    let url =
      'https://accounts.spotify.com/authorize?client_id=' +
      client_id +
      '&response_type=token' +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&redirect_uri=' +
      encodeURIComponent(redirect_uri);
    document.location = url;
  }

  const performAuthDance = useCallback(() => {
    // if we already have a token and it hasn't expired, use it,
    if ('credentials' in localStorage) {
      credentials = JSON.parse(localStorage.credentials);
    }

    if (credentials && credentials.expires > getTime()) {
      $('#search-form').show();
    } else {
      // we have a token as a hash parameter in the url
      // so parse hash
      let hash = window.location.hash.replace(/#/g, '');
      let all = hash.split('&');
      let args = {};

      all.forEach(function (keyvalue) {
        let idx = keyvalue.indexOf('=');
        let key = keyvalue.substring(0, idx);
        let val = keyvalue.substring(idx + 1);
        args[key] = val;
      });

      if (typeof args['access_token'] != 'undefined') {
        let g_access_token = args['access_token'];
        let expiresAt = getTime() + 3600;

        if (typeof args['expires_in'] != 'undefined') {
          let expires = parseInt(args['expires_in']);
          expiresAt = expires + getTime();
        }

        credentials = {
          token: g_access_token,
          expires: expiresAt,
        };

        callSpotify('https://api.spotify.com/v1/me').then(
          function (user) {
            credentials.user_id = user.id;
            localStorage['credentials'] = JSON.stringify(credentials);
            window.location.hash = '';
            $('#search-form').show();
          },
          function () {
            error("Can't get user info");
          }
        );
      } else {
        // otherwise, got to spotify to get auth
        $('#login-form').show();
      }
    }
  }, []);

  useEffect(() => {
    initApp();
    performAuthDance();
  }, [initApp, performAuthDance]);

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
              <FormControl isRequired>
                <FormLabel htmlFor='playlist-terms'>
                  Search playlists by genre
                </FormLabel>
                <Input
                  id='playlist-terms'
                  variant='filled'
                  placeholder="'work out' OR workout "
                />
              </FormControl>
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

      <Box className='container-fluid work' p='30px'>
        <Center>
          <Box id='info' fontSize='2xl' m={4}></Box>
        </Center>

        <Box className='results' id='playlist-table'>
          <Center>
            <Box id='attitle' fontSize='4xl' fontWeight='bold'>
              Matching Playlists for <span className='keywords'></span>
            </Box>
          </Center>
          {/* ------------ Progress bar here ------------ */}
          <Box className='button-row' fontSize='18px'>
            <Center>
              <Text>
                Here are the <span className='total-playlists'> </span> matching
                playlists with a total of{' '}
                <span className='total-tracks'> 0 </span> tracks.
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
            <Table variant='simple' colorScheme='linkedin'>
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
          {/* ------------ Progress bar here ------------ */}
          <TableContainer>
            <Table variant='simple' colorScheme='linkedin'>
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
