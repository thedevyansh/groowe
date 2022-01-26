import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import theme from './theme';
import Layout from './Layout';
import MaintenancePage from './MaintenancePage';

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
      <Layout>
        <MaintenancePage />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
