import React from 'react';
import { Global, css } from '@emotion/react';

function GradientBackground({ children, src }) {
  return (
    <>
      <Global
        styles={css`
          body {
            height: 100%;
            background: url('${src ?? '/DarkGradient.jpeg'}') no-repeat center
              center fixed !important;
            background-color: #040d21 !important;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover !important;
          }
        `}
      />
      {children}
    </>
  );
}

export default GradientBackground;
