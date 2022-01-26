import React, { useRef } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import emailjs from '@emailjs/browser';

const validateName = value => {
  return value ? true : 'Name is required';
};

const validateMessage = value => {
  return value ? true : 'Description is required';
};

function SendMessageModal({ isOpen, onClose }) {
  const form = useRef();
  const toast = useToast();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm();

  const handleSendMessage = values => {
    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_USER_ID
      )
      .then(
        result => {
          toast({
            title: 'Message received',
            description:
              "We've got your message. Temporal.DJ will be live again soon.",
            status: 'success',
            duration: 6000,
          });
        },
        error => {
          toast({
            title: 'Error',
            description: 'An error occured. Please try again later.',
            status: 'error',
            duration: 6000,
          });
        }
      );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent bg='gray.900'>
        <form ref={form} onSubmit={handleSubmit(handleSendMessage)}>
          <ModalHeader>Send a message!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack px={4} py={5} spacing={5} p={{ sm: 6 }}>
              <FormControl isInvalid={errors.name}>
                <FormLabel
                  htmlFor='name'
                  fontSize='sm'
                  fontWeight='md'
                  color='gray.50'>
                  Name
                </FormLabel>
                <Input
                  name='name'
                  {...register('name', {
                    validate: validateName,
                  })}
                  placeholder='Your name'
                  rounded='md'
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
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
