import React,{useState,useEffect}from 'react';
import "./css/tagspop.css"
import { fetchTags , addTag } from './api';
const TagsPopup = ({
 
  handleRemoveTag,
  handleInputChange,
  handleInputKeyDown,
  inputValue,
  closeTagsPopup,
  suggestedTags,
  
}) => {
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const handleAddTag = async () => {
    try {
      // Add the new tag to the state
      setTags([...tags, { title: inputValue }]);
  
      // Clear the input field
      handleInputChange({ target: { value: '' } });
  
      // Add the new tag to the database
      await addTag({ title: inputValue });
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        const tagsData = await fetchTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTagsData();
  }, []);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = suggestedTags.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(suggestedTags.length / itemsPerPage);

  const renderPaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => setCurrentPage(i)}>
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="tags-popup">
      <h4>Add Tags</h4>

      {/* Tags Table */}
      <table className="tags-table">
        <thead>
          <tr>
            <th>Tags Title</th>
          </tr>
        </thead>
        <tbody>
          {currentTags.map((tag, index) => (
            <tr key={index}>
              <td>{tag.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* Pagination Controls */}
       <div className="tags-pagination-controls">
        {renderPaginationControls()}
      </div>

      {/* Input for Adding Tags */}
      <div className="tags-input-container">
        <input 
          type="text"
          placeholder="Add tags..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          list="suggestedTags"
        />
        <datalist id="suggestedTags">
          {suggestedTags.map((tag, index) => (
            <option key={index} value={tag.title} />
          ))}
        </datalist>
           {/* Button to add the tag */}
           <button type="button" onClick={handleAddTag} className='tagbutton'>
          Add Tag
        </button>
                 {/* Close Button */}
      <button type="button" onClick={closeTagsPopup} className='tagbutton'>
        Close
      </button>
      </div>
    </div>
  );
};

export default TagsPopup;
