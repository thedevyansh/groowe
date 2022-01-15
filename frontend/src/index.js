import React from 'react';
import ReactDOM from 'react-dom';
import { ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import 'focus-visible/dist/focus-visible';
import { config } from './theme';
import store from './store';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
