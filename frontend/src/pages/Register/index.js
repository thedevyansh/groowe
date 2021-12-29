import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register as apiRegister } from '../../slices/userSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Link as ReactLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowConfirmPW = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const [passwordValue, setPasswordValue] = useState('');

  const validateUsername = value => {
    return value ? true : 'Enter your username';
  };

  const validatePassword = value => {
    return value ? true : 'Enter your password';
  };

  const validateConfirmPassword = value => {
    if (!value) {
      return 'Confirm your password';
    } else if (value !== passwordValue) {
      return 'Passwords do not match';
    }
    return true;
  };

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const toast = useToast();
  const onSubmit = data => {
    const body = {
      username: data.username,
      password: data.password,
    };

    return dispatch(apiRegister(body)).then(res => {
      if (res.type === 'user/register/rejected') {
        toast({
          title: 'Registration error',
          description: res?.error?.message ?? 'Please try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (res.type === 'user/register/fulfilled') {
        window.location.reload();
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Register - Temporal.dj</title>
      </Helmet>
      <Box maxW='md' mx='auto' py='5%'>
        <Heading textAlign='center' size='lg' padding='1rem'>
          Let's get you set up.
        </Heading>
        <Box py='6' px={{ base: '4', md: '10' }} rounded={{ sm: 'lg' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing='6'>
              <FormControl isInvalid={errors.username}>
                <FormLabel htmlFor='username'>Username</FormLabel>
                <Input
                  id='username'
                  {...register('username', { validate: validateUsername })}
                  placeholder='Enter your username'
                  _placeholder={{ color: 'white' }}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <InputGroup>
                  <Input
                    id='password'
                    {...register('password', { validate: validatePassword })}
                    onChange={event => setPasswordValue(event.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    _placeholder={{ color: 'white' }}
                  />
                  <InputRightElement>
                    <IconButton
                      onClick={handleShowPassword}
                      variant='ghost'
                      size='sm'
                      icon={showPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel htmlFor='confirmPassword'>
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id='confirmPassword'
                    {...register('confirmPassword', {
                      validate: validateConfirmPassword,
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    _placeholder={{ color: 'white' }}
                  />
                  <InputRightElement>
                    <IconButton
                      onClick={handleShowConfirmPW}
                      variant='ghost'
                      size='sm'
                      icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                isLoading={isSubmitting}
                type='submit'
                colorScheme='blue'
                size='lg'
                fontSize='md'>
                Register
              </Button>
              <Text mt='4' mb='8' align='center' maxW='md' fontWeight='medium'>
                <Text as='span'>Already have an account? </Text>
                <Link color='blue.200' as={ReactLink} to='/login'>
                  Login here.
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Register;
