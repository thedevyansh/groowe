import React from 'react';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';
import './index.css';

const tagifySettings = {
  maxTags: 3,
  placeholder: 'Tag genres',
};

const TagsSelector = React.forwardRef((props, ref) => {
  const handleTagifyChange = e => {
    try {
      if (e.detail.value !== '') {
        ref.current = JSON.parse(e.detail.value);
      } else {
        ref.current = [];
      }
    } catch (err) {
    }
  };

  return (
    <>
      <Tags
        className='customLook'
        settings={tagifySettings}
        onChange={handleTagifyChange}
      />
    </>
  );
});

TagsSelector.displayName = 'TagsSelector';

export default TagsSelector;
