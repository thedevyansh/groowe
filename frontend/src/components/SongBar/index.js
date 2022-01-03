import React from 'react';
import { Drawer, Stack, Flex, useDisclosure } from '@chakra-ui/react';
import styled from '@emotion/styled';
import LeftSide from './subcomponents/LeftSide';
import Center from './subcomponents/Center';
import RightSide from './subcomponents/RightSide';
import SongDrawer from './subcomponents/SongDrawer';
import Vote from '../Vote';
import ChatBox from '../ChatBox';

const Bar = styled(Stack)`
  z-index: 1;
  width: 100%;
  bottom: 0;
  border-top-left-radius: 100;
  border-top-right-radius: 100;
  pointer-events: auto;
`;

export default function SongBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      pointerEvents='none'
      flexDirection='column'
      position='absolute'
      left={0}
      right={0}
      bottom={0}>
      <Flex justifyContent='space-between'>
        <Vote />
        <ChatBox />
      </Flex>
      <Bar
        spacing={4}
        direction={{ base: 'column', sm: 'row' }}
        position='relative'
        align='center'
        justify='space-between'
        wrap='wrap'
        padding={4}
        bgColor='rgba(14, 22, 40, 0.85)'
        color='white'>
        <LeftSide openDrawer={onOpen} />
        <Center />
        <RightSide />
      </Bar>
      <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
        <SongDrawer handleOnClose={onClose} />
      </Drawer>
    </Flex>
  );
}
