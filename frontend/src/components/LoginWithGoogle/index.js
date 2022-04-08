import React from 'react';
import { Box } from '@chakra-ui/react';
import GoogleButton from 'react-google-button';

const URI =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api/auth/google'
    : 'https://temporaldj.herokuapp.com//api/auth/google';

function LoginWithGoogle() {
  return (
    <Box align='center' mt='30px'>
      <GoogleButton
        onClick={() => {
          window.open(URI, '_self');
        }}
      />
    </Box>
  );
}

export default LoginWithGoogle;
