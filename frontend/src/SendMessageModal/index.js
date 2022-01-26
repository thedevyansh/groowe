import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
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
} from '@chakra-ui/react';

const validateEmail = value => {
  return value ? true : 'Email is required';
};

const validateMessage = value => {
  return value ? true : 'Description is required';
};

function SendMessageModal({ isOpen, onClose }) {
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();

  const handleSendMessage = values => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent bg='gray.900'>
        <form onSubmit={handleSubmit(handleSendMessage)}>
          <ModalHeader>Send a message!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack px={4} py={5} spacing={5} p={{ sm: 6 }}>
              <FormControl isInvalid={errors.email}>
                <FormLabel
                  htmlFor='email'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Email
                </FormLabel>
                <Input
                  name='email'
                  id='email'
                  type='email'
                  {...register('email', {
                    validate: validateEmail,
                  })}
                  placeholder='Your email'
                  rounded='md'
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.description} mt={1}>
                <FormLabel
                  htmlFor='description'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Ask to bring Temporal.DJ up
                </FormLabel>
                <Textarea
                  name='description'
                  {...register('description', {
                    validate: validateMessage,
                  })}
                  placeholder='Please bring the site up.'
                  mt={1}
                  rows={3}
                  shadow='sm'
                  fontSize={{ sm: 'sm' }}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
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

export default SendMessageModal;
