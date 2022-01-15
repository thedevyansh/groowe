import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import theme from './theme';
import Layout from './components/Layout';
import withAuthorization from './components/hoc/withAuthorization';
import {
  PUBLIC_PAGE,
  LOGGED_IN_ONLY,
  NON_LOGGED_ONLY,
} from './components/hoc/options';

import { SocketContext, socket } from './contexts/socket';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import AccountSettings from './pages/AccountSettings';
import ErrorNotFound from './pages/ErrorNotFound';

import '@fontsource/poppins/700.css';
import '@fontsource/poppins/900.css';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/700.css';

const GlobalStyles = css`
  /*
    This will remove the ugly border on clicking the buttons, icons, etc. (which Chakra has put in place
    to enable accessibility). But it will still show up on keyboard focus!
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

function App() {
  localStorage.setItem('chakra-ui-color-mode', 'dark');

  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Layout>
            <Switch>
              <Route
                path='/'
                exact
                component={withAuthorization(Home, PUBLIC_PAGE)}
              />
              <Route
                path='/register'
                exact
                component={withAuthorization(Register, NON_LOGGED_ONLY)}
              />
              <Route
                path='/login'
                exact
                component={withAuthorization(Login, NON_LOGGED_ONLY)}
              />
              <Route
                path='/rooms'
                exact
                component={withAuthorization(Rooms, PUBLIC_PAGE)}
              />
              <Route
                path='/room/:id'
                exact
                component={withAuthorization(Room, PUBLIC_PAGE)}
              />
              <Route
                path='/account'
                exact
                component={withAuthorization(AccountSettings, LOGGED_IN_ONLY)}
              />
              <Route
                path='/'
                component={withAuthorization(ErrorNotFound, PUBLIC_PAGE)}
              />
            </Switch>
          </Layout>
        </BrowserRouter>
      </SocketContext.Provider>
    </ChakraProvider>
  );
}

export default App;
