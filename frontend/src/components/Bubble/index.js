import React, { useState } from 'react';
import {
  Avatar,
  Tag,
  ScaleFade,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
} from '@chakra-ui/react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

function Bubble(props) {
  const { profilePicture, username, prefix, type, position, reaction } = props;
  const [isHover, setIsHover] = useState(false);
  const showTag = isHover || type === 'songPicker';
  let tagColor = 'blue';

  // Prevents dragging text and images
  const preventDragHandler = e => {
    e.preventDefault();
  };

  switch (type) {
    case 'songPicker':
      tagColor = 'red';
      break;
    default:
      break;
  }

  const handleHover = e => {
    setIsHover(true);
  };

  const handleUnHover = e => {
    setIsHover(false);
  };

  return (
    <Draggable
      disabled={true}
      position={position}
      defaultClassName='_draggable'
      defaultClassNameDragging='__dragging'
      defaultClassNameDragged='__dragged'
      bounds='#canvas'>
      <motion.div
        style={{
          position: 'absolute',
          display: 'flex',
          transition: 'transform .1s linear',
          width: '128px',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onMouseEnter={handleHover}
        onMouseLeave={handleUnHover}
        key='test'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <Popover
          autoFocus={false}
          isOpen={reaction}
          placement='top'
          arrowSize={10}>
          <PopoverTrigger>
            <Avatar
              cursor={type !== 'you' ? 'pointer' : 'move'}
              size='lg'
              src={profilePicture}
              name={username}
              onDragStart={preventDragHandler}
            />
          </PopoverTrigger>
          <PopoverContent maxW='43px' bg='rgba(12, 22, 45)'>
            <PopoverArrow bg='#0c162d' />
            <PopoverBody px='10px'>{reaction}</PopoverBody>
          </PopoverContent>
        </Popover>

        <ScaleFade in={showTag} initialScale={0.8}>
          <Tag
            mt={4}
            variant='solid'
            colorScheme={tagColor}
            maxW='128px'
            textAlign='center'>
            {`${prefix} ${username.substr(0, 20)}`}
          </Tag>
        </ScaleFade>
      </motion.div>
    </Draggable>
  );
}

export default Bubble;
