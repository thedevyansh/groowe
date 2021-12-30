import React, { useEffect } from 'react';
import { authenticate } from '../../slices/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Fade, useToast } from '@chakra-ui/react';
import { LOGGED_IN_ONLY, NON_LOGGED_ONLY } from './options';
import LoadingView from '../LoadingView';

function withAuthorization(WrappedComponent, option) {
  function AuthenticationCheck(props) {
    const user = useSelector(state => state.user);
    const { authenticated, status } = user;
    const dispatch = useDispatch();
    const toast = useToast();
    const loadingFinished = status !== 'idle' && status !== 'loading';

    useEffect(() => {
      if (status === 'idle') {
        dispatch(authenticate());
      }
    }, [status, dispatch]);

    if (loadingFinished) {
      if (!authenticated && option === LOGGED_IN_ONLY) {
        toast({
            title: 'Cannot get auth route.',
            status: 'info',
            duration: '2000',
            position: 'top',
          });
        props.history.push('/login');
        return null;
      } else if (authenticated && option === NON_LOGGED_ONLY) {
        props.history.push('/');
        return null;
      }
    } else {
      return <LoadingView />;
    }

    return (
      <Fade in={loadingFinished}>
        <WrappedComponent {...props} user={user} />
      </Fade>
    );
  }

  return AuthenticationCheck;
}

export default withAuthorization;
