import React, { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../../contexts/socket';
import { useDispatch } from 'react-redux';
import { createRoom } from '../../slices/currentRoomSlice';
import {
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
  useToast,
} from '@chakra-ui/react';
import TagsSelector from '../TagsSelector';

const validateRoomName = value => {
  return value ? true : 'Room name is required';
};

const validateDescription = value => {
  return value ? true : 'Description is required';
};

function CreateRoomModal({ isOpen, onClose }) {
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();
  const tagsRef = useRef([]);
  const socket = useContext(SocketContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const toast = useToast();

  const handleCreateRoom = values => {
    const dataToSubmit = {
      name: values.roomName,
      description: values.description,
      genres: tagsRef?.current?.map(tag => tag.value) ?? [],
      private: values.privateRoom,
    };

    return new Promise(resolve => {
      socket.emit('create_room', dataToSubmit, response => {
        const { success, room } = response;
        if (success && room?.id) {
          // Redirect to room page
          dispatch(createRoom(response));
          resolve();
          onClose();
          history.push(`/room/${room.id}`);
        } else {
          toast({
            title: 'Error creating room',
            description: "Couldn't create a room, please try again.",
            status: 'error',
            duration: 2000,
          });
          resolve();
        }
      });
    });
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size='3xl' isCentered>
      <ModalOverlay />
      <ModalContent bg='gray.900'>
        <form onSubmit={handleSubmit(handleCreateRoom)}>
          <ModalHeader>Create Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack px={4} py={5} spacing={5} p={{ sm: 6 }}>
              <FormControl isInvalid={errors.roomName}>
                <FormLabel
                  htmlFor='roomName'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Room name
                </FormLabel>
                <Input
                  name='roomName'
                  {...register('roomName', {
                    validate: validateRoomName,
                  })}
                  placeholder='A fun name'
                  rounded='md'
                />
                <FormErrorMessage>
                  {errors.roomName && errors.roomName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description} mt={1}>
                <FormLabel
                  htmlFor='description'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Description
                </FormLabel>
                <Textarea
                  name='description'
                  {...register('description', {
                    validate: validateDescription,
                  })}
                  placeholder="We'll be listening to some fun tracks here."
                  mt={1}
                  rows={3}
                  shadow='sm'
                  fontSize={{ sm: 'sm' }}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
                <FormHelperText>
                  Describe what you'll be doing in this room.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel
                  htmlFor='genres'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Tags
                </FormLabel>
                <TagsSelector name='genres' ref={tagsRef} />
                <FormHelperText>Choose up to three genres.</FormHelperText>
              </FormControl>

              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='privateRoom'>Private room? </FormLabel>
                <Switch {...register('privateRoom')} name='privateRoom' />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant='outline' size='sm' onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='blue'
              ml={3}
              isLoading={isSubmitting}
              size='sm'
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
