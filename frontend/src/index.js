import React from 'react';
import ReactDOM from 'react-dom';
import { ColorModeScript } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import 'focus-visible/dist/focus-visible';
import { config } from './theme';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
