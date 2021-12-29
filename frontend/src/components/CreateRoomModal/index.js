import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  useColorModeValue,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Switch,
} from '@chakra-ui/react';

const validateRoomName = value => {
  return value ? true : 'Room name is required';
};

const validateDescription = value => {
  return value ? true : 'Description is required';
};

function CreateRoomModal(props) {
  const { isOpen, onClose } = props;
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  const initialFocusRef = useRef(); // For auto focus input on open
  const tagsRef = useRef([]); // To store genre tags

  return (
    <Modal
      initialFocusRef={initialFocusRef}
      isOpen={isOpen}
      onClose={onClose}
      size='3xl'>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('white', 'gray.900')} color='white'>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Create Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack px={4} py={5} spacing={6} p={{ sm: 6 }}>
              <FormControl isInvalid={errors.roomName}>
                <FormLabel
                  htmlFor='roomName'
                  fontSize='sm'
                  fontWeight='md'
                  color={useColorModeValue('gray.700', 'gray.50')}>
                  Room name
                </FormLabel>
                <Input
                  name='roomName'
                  {...register('roomName', {
                    validate: validateRoomName,
                  })}
                  ref={initialFocusRef}
                  type='tel'
                  placeholder='A fun name'
                  rounded='md'
                />
                <FormErrorMessage>
                  {errors.roomName && errors.roomName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description} id='email' mt={1}>
                <FormLabel
                  htmlFor='description'
                  fontSize='sm'
                  fontWeight='md'
                  color={useColorModeValue('gray.700', 'gray.50')}>
                  Description
                </FormLabel>
                <Textarea
                  name='description'
                  {...register('description', {
                    validate: validateDescription,
                  })}
                  placeholder="We'll be listening to some fun tracks here"
                  mt={1}
                  rows={3}
                  shadow='sm'
                  fontSize={{ sm: 'sm' }}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
                <FormHelperText>
                  Describe what you&apos;ll be doing in this room.
                </FormHelperText>
              </FormControl>

              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='privateRoom'>Private room?</FormLabel>
                <Switch {...register('privateRoom')} name='privateRoom' />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='blue'
              ml={3}
              isLoading={isSubmitting}
              type='submit'>
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CreateRoomModal;
