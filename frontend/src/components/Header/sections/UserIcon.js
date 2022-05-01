import React from 'react';
import { Avatar, MenuButton, HStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserAlt } from 'react-icons/fa';
import { BiInfoCircle } from 'react-icons/bi';

const UserIcon = ({ isLoaded, isAuth, image }) => {
  if (!isLoaded) {
    return null;
  } else if (isAuth) {
    return (
      <>
        <MenuButton display='flex' alignItems='center'>
          <Avatar size='sm' bg='gray.800' src={image} />
        </MenuButton>
        <Link to='/about'>
          <Button variant='ghost' ml={2}>
            <BiInfoCircle size={25} />
          </Button>
        </Link>
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
        <Link to='/about'>
          <Button variant='ghost'>
            <BiInfoCircle size={25} />
          </Button>
        </Link>
      </HStack>
    );
  }
};

export default UserIcon;
