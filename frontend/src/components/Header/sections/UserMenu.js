import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../slices/userSlice';
import {
  Box,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { SettingsIcon, LockIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

function UserMenu({ isAuth, username }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isAuth) {
    return (
      <Box zIndex='3'>
        <MenuList>
          <MenuGroup title={username}>
            <Link to='/account'>
              <MenuItem icon={<SettingsIcon />}>My account</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider />
          <MenuItem icon={<LockIcon />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </MenuList>
      </Box>
    );
  }
  return null;
}

export default UserMenu;
