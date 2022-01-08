import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { update, authenticate } from '../../slices/userSlice';
import {
  chakra,
  Container,
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormErrorMessage,
  Avatar,
  Text,
  Button,
  Divider,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

const validateAvatar = value => {
  return value.match(
    /^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp|webp|svg)(\?(.*))?$/gim
  ) != null
    ? true
    : 'Enter a valid image url';
};

function AccountSettings() {
  const { profilePicture, username } = useSelector(state => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();
  const avatarUrl = useRef(profilePicture);
  const [avatarUrlState, setAvatarUrlState] = useState(profilePicture);
  const toast = useToast();

  useEffect(() => {
    setAvatarUrlState(profilePicture);
  }, [profilePicture]);

  const handleSaveAvatar = () => {
    setAvatarUrlState(avatarUrl.current);
    onClose();
  };

  const handleAvatarUrlChange = e => {
    avatarUrl.current = e.target.value;
  };

  const onSubmit = data => {
    const dataToSubmit = {
      profilePicture: data?.profilePicture ?? profilePicture,
    };
    return dispatch(update(dataToSubmit)).then(res => {
      if (res.type === 'user/update/rejected') {
        toast({
          title: 'Account update error',
          description: res?.error?.message ?? 'Please try again',
          status: 'error',
          duration: 2000,
        });
      } else if (res.type === 'user/update/fulfilled') {
        dispatch(authenticate());
      }
    });
  };

  return (
    <Container
      maxW={{
        base: 'container.sm',
        sm: 'container.sm',
        md: 'container.md',
        lg: 'container.lg',
        xl: 'container.xl',
      }}
      p={10}>
      <Helmet>
        <title>My Account - Temporal.DJ</title>
      </Helmet>
      <chakra.form
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        overflow={{ sm: 'hidden' }}>
        <Stack px={4} py={4} p={{ sm: 6 }}>
          <Text fontSize='xl' fontWeight='semibold'>
            Username - {username}
          </Text>
          <Divider />
          <FormControl isInvalid={errors.profilePicture}>
            <FormLabel
              htmlFor='profilepicture-url'
              fontSize='lg'
              fontWeight='md'>
              Profile Picture
            </FormLabel>
            <Flex alignItems='center' mt={1}>
              <Avatar boxSize={16} bg='gray.800' src={avatarUrlState} />
              {isOpen ? (
                <Box ml={8} w='100%'>
                  <InputGroup size='md'>
                    <Input
                      id='profilepicture-url'
                      {...register('profilePicture', {
                        validate: validateAvatar,
                      })}
                      defaultValue={avatarUrlState}
                      onChange={handleAvatarUrlChange}
                    />
                    <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleSaveAvatar}>
                        Done
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>Enter an image URL</FormHelperText>
                </Box>
              ) : (
                <Button
                  onClick={onOpen}
                  type='button'
                  ml={5}
                  variant='outline'
                  size='sm'
                  fontWeight='medium'>
                  Change
                </Button>
              )}
            </Flex>
            <FormErrorMessage>
              {errors.profilePicture && errors.profilePicture.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Box px={{ base: 4, sm: 6 }} py={3}>
          <Button
            isLoading={isSubmitting}
            type='submit'
            colorScheme='blue'
            fontWeight='md'>
            Update profile picture
          </Button>
        </Box>
      </chakra.form>
    </Container>
  );
}

export default AccountSettings;
