import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../slices/userSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Link as ReactLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HorizontalHeading } from '../../horizontalHeading';

const validateUsername = value => {
  return value ? true : 'Enter your username';
};

const validatePassword = value => {
  return value ? true : 'Enter your password';
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const toast = useToast();
  const onSubmit = data =>
    dispatch(login(data)).then(res => {
      if (res.type === 'user/login/rejected') {
        toast({
          title: 'Login error',
          description: res?.error?.message ?? 'Please try again.',
          status: 'error',
          duration: 2000,
        });
      } else if (res.type === 'user/login/fulfilled') {
        window.location.reload();
      }
    });

  return (
    <>
      <Helmet>
        <title>Login - Temporal.DJ</title>
      </Helmet>
      <Box maxW='md' mx='auto' py='5%'>
        <Heading textAlign='center' size='lg' padding='1rem'>
          Login to resume fun
        </Heading>
        <Box py='6' px={{ base: '4', md: '10' }}>
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    _placeholder={{ color: 'white' }}
                  />
                  <InputRightElement>
                    <IconButton
                      onClick={handleClick}
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
              <Button
                isLoading={isSubmitting}
                type='submit'
                colorScheme='blue'
                size='lg'
                fontSize='md'>
                Login
              </Button>
              <Text mt='4' mb='8' align='center' maxW='md' fontWeight='medium'>
                <Text as='span'>Don&apos;t have an account? </Text>
                <Link color='blue.200' as={ReactLink} to='/register'>
                  Register here.
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Box>
      <HorizontalHeading>TEMPORAL.DJ</HorizontalHeading>
    </>
  );
}

export default Login;
