import { extendTheme, theme as base } from '@chakra-ui/react';

export const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts: {
    heading: `Rubik, ${base.fonts?.heading}`,
    body: `Rubik, ${base.fonts?.body}`,
  },
  styles: {
    global: props => ({
      body: {
        color: props.colorMode === 'dark' ? 'gray.200' : 'gray.800',
      },
    }),
  },
};

const theme = extendTheme(config);

export default theme;
