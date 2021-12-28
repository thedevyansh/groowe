import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import withAuthorization from './components/hoc/withAuthorization';
import {
  PUBLIC_PAGE,
  LOGGED_IN_ONLY,
  PUBLIC_ONLY,
} from './components/hoc/options';

import Home from './pages/Home';
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
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/' component={ErrorNotFound} />
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
