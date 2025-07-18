import React from 'react';
import Select from 'react-select';
import '../styles/TagInput.css';

export default function TagInput({
  availableTags = [],
  selectedTags = [],
  setSelectedTags = () => {},
}) {
  const options = availableTags.map(tag => ({
    value: tag,
    label: tag,
  }));

  const handleChange = (selectedOptions) => {
    const tags = selectedOptions.map(opt => opt.value);
    setSelectedTags(tags);
  };

  const selectedOptions = selectedTags.map(tag => ({
    value: tag,
    label: tag,
  }));

  return (
    <div className="tag-input-container">
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti
        placeholder="Selecione as tags..."
        className="tag-select"
      />
    </div>
  );
}
