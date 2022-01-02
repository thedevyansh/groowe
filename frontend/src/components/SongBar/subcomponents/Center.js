import React from 'react';
import { useSelector } from 'react-redux';
import JoinQueueButton from '../../JoinQueueButton';

function Center() {
  const authenticated = useSelector(state => state.user.authenticated);

  if (!authenticated) {
    return null;
  }

  return <JoinQueueButton />;
}

export default Center;
