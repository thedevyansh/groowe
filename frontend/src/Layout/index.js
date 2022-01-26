import React from 'react';
import Header from '../Header';
import GradientBackground from '../GradientBackground';

function Layout({ children }) {
  return (
    <GradientBackground src='/DarkGradient.jpeg'>
      <Header />
      {children}
    </GradientBackground>
  );
}

export default Layout;
