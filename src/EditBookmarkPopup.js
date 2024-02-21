// EditBookmarkPopup.js
import React, { useState } from 'react';

const EditBookmarkPopup = ({ bookmark, onSave, onCancel }) => {
  const [editedBookmark, setEditedBookmark] = useState({ ...bookmark });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBookmark((prevBookmark) => ({
      ...prevBookmark,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedBookmark);
  };

  return (
    <div className="edit-popup">
      <h4>Edit Bookmark</h4>
      <label htmlFor="editTitle">Title:</label>
      <input
        type="text"
        id="editTitle"
        name="title"
        value={editedBookmark.title}
        onChange={handleInputChange}
      />
      <label htmlFor="editURL">URL:</label>
      <input
        type="text"
        id="editURL"
        name="url"
        value={editedBookmark.url}
        onChange={handleInputChange}
      />
      {/* Add other fields as needed */}
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditBookmarkPopup;
