import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Layout from './components/Layout';
import withAuthorization from './components/hoc/withAuthorization';
import {
  PUBLIC_PAGE,
  LOGGED_IN_ONLY,
  NON_LOGGED_ONLY,
} from './components/hoc/options';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountSettings from './pages/AccountSettings';
import ErrorNotFound from './pages/ErrorNotFound';

import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

function App() {
  localStorage.setItem('chakra-ui-color-mode', 'dark');

  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
}

export default App;
