import React from 'react';
import { Avatar, MenuButton, HStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserAlt, IoIosMusicalNote } from 'react-icons/all';

const UserIcon = ({ isLoaded, isAuth, image }) => {
  if (!isLoaded) {
    return null;
  } else if (isAuth) {
    return (
      <>
        <Link to='/spotify-recommender'>
          <Button variant='ghost' mr={2}>
            <IoIosMusicalNote size={25} />
          </Button>
        </Link>
        <MenuButton display='flex' alignItems='center'>
          <Avatar size='sm' bg='gray.800' src={image} />
        </MenuButton>
      </>
    );
  } else {
    return (
      <HStack>
        <Link to='/register'>
          <Button leftIcon={<FaUserAlt />} variant='ghost' fontWeight='10px'>
            Register
          </Button>
        </Link>
        <Link to='/login'>
          <Button leftIcon={<FaSignInAlt />} variant='ghost' fontWeight='10px'>
            Login
          </Button>
        </Link>
      </HStack>
    );
  }
};

export default UserIcon;
