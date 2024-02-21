import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './css/dashboard.css'
import TagsPopup from './tags'
import SearchPopup from './SearchPopup';
import FilterPopup from './FilterPopup';
import { fetchBookmarks, addBookmark ,updateBookmarkApi, fetchTags, deleteBookmarkApi} from './api';
const Dash = () => {
  const [allTags, setAllTags] = useState([]);
  const [url, seturl]= useState('');
  const [title, settitle]=useState('');
  const [description,setdescription]=useState('');
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isFormVisible, setFormVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState([]); 
  const [editingBookmarkIndex, setEditingBookmarkIndex] = useState(null);
  const [isTagsPopupVisible, setTagsPopupVisible] = useState(false);//tags.js page
  const [selectedTags, setSelectedTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);
  const toggleSearchPopupVisibility = () => {
    setSearchPopupVisible(!isSearchPopupVisible);
  };
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => setIsCopied(true))
      .catch((error) => console.error('Error copying to clipboard:', error));
  };
  //sort
  const [selectedFilter] = useState('');

   // Sorting logic
   const performSort = (a, b, sortDirection) => {
    // Modify your sorting logic based on your data structure
    // This is a simple example, you might need to adjust it according to your needs
    const valueA = a.title.toLowerCase();
    const valueB = b.title.toLowerCase();

    if (valueA < valueB) {
      return sortDirection === 'ascending' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'ascending' ? 1 : -1;
    }
    return 0;
  };

  // Filter and sort logic
  const applyFilter = (selectedFilter) => {
    switch (selectedFilter) {
      case 'ascending':
        setBookmarks(bookmarks.slice().sort((a, b) => performSort(a, b, 'ascending')));
        break;
      case 'descending':
        setBookmarks(bookmarks.slice().sort((a, b) => performSort(a, b, 'descending')));
        break;
      // Add more filter options and their handling as needed
      default:
        // Handle other filter options or set a default action
    }
  };

  //filter
  const [isFilterPopupVisible, setFilterPopupVisible] = useState(false);

  const toggleFilterPopupVisibility = () => {
    setFilterPopupVisible(!isFilterPopupVisible);
  };
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookmarks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);

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
  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        const tagsData = await fetchTags();
        if (tagsData) {
          setAllTags(tagsData);
        } else {
          console.error('Tags data is undefined.');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
  
    fetchTagsData();
  }, []);
  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        const tagsData = await fetchTags();
        setAllTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTagsData();
  }, []);


  const fetchAndUpdateBookmarks = async () => {
    try {
      const bookmarksData = await fetchBookmarks();
      setBookmarks(bookmarksData);
    } catch (error) {
      // Handle error
      console.error('Error fetching bookmarks:', error);
    }
  };
  useEffect(() => {
    fetchAndUpdateBookmarks();
  }, []);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      console.log("tags"+inputValue)
      setInputValue('');
    }
  };
  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const toggleTagsPopupVisibility = () => {
    setTagsPopupVisible(!isTagsPopupVisible);
  };//tags.js page

  const handleSaveBookmark = async (index) => {
    try {
      const updatedBookmark = {
        id: bookmarks[index].id,
        url: url,
        title: title,
        description: description,
      
      };

     // Update the bookmark using the API function
     await updateBookmarkApi(updatedBookmark);

     // Fetch updated bookmarks after updating
     const updatedBookmarksData = await fetchBookmarks();
 
     // Find the index of the updated bookmark in the new data
    const updatedIndex = updatedBookmarksData.findIndex((bookmark) => bookmark.id === updatedBookmark.id);

    // Update the state with the new bookmarks array
    setBookmarks((prevBookmarks) => {
      const newBookmarks = [...prevBookmarks];
      newBookmarks[index] = updatedBookmarksData[updatedIndex];
      return newBookmarks;
    });
 
     // Reset the form and editing state
     seturl('');
     settitle('');
     setdescription('');
     setTags([]);
     setEditingBookmarkIndex(null);
   } catch (error) {
     // Handle error
     console.error('Error in handleSaveBookmark:', error);
   }
 };



 const handleDeleteBookmark = async (index) => {
  try {
    const bookmarkIdToDelete = bookmarks[index].id;
    // Use deleteBookmarkApi to delete the bookmark by its ID
    await deleteBookmarkApi(bookmarkIdToDelete);

    // Create a copy of the current bookmarks array excluding the deleted bookmark
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== bookmarkIdToDelete);

    // Update the state with the new bookmarks array
    setBookmarks(updatedBookmarks);
  } catch (error) {
    // Handle error
    console.error('Error deleting bookmark:', error);
  }
};

  const handleShareBookmark = (index) => {
    // Assuming you want to share the bookmark in a modal or perform some sharing functionality
    const bookmarkToShare = bookmarks[index];
    const contentToCopy = `${bookmarkToShare.title}\n${bookmarkToShare.description}\n${bookmarkToShare.url}`;

  // Copy content to clipboard and show a message
  copyToClipboard(contentToCopy);

  // Reset the copied status after a few seconds
  setTimeout(() => setIsCopied(false), 3000);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookmarksData = await fetchBookmarks();
        setBookmarks(bookmarksData);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);
  
  const handleAddBookmark = async () => {
    try {
       // Check if any of the required fields are empty
    if (!url.trim() || !title.trim() || !selectedTags.length || !description.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

       // Check if the URL already exists in the frontend state (optional)
    const urlExistsInFrontend = bookmarks.some((bookmark) => bookmark.url === url);
    if (urlExistsInFrontend) {
      // Handle the case where the URL already exists in the frontend state
      setErrorMessage('URL already exists');
      console.error('Bookmark with this URL already exists in the frontend');
      return;
    }

    // Check if the URL already exists in the backend
    const existingBookmark = await fetchBookmarks();
    const urlExistsInBackend = existingBookmark.some((bookmark) => bookmark.url === url);
    if (urlExistsInBackend) {
      // Handle the case where the URL already exists in the backend
      setErrorMessage(' URL already exists ss');
      console.error('Bookmark with this URL already exists in the backend');
      return;
    }

      let tags = selectedTags.map(tag => tag.value)
      const newBookmark = { url, title, description, tags };
      // Add logic for adding a bookmark using the API
      await addBookmark(newBookmark);

      // Fetch updated bookmarks after adding a new one
      const bookmarksData = await fetchBookmarks();
      setBookmarks(bookmarksData);

      // Clear the form after adding the bookmark
      seturl('');
      settitle('');
      setdescription('');
      setSelectedTags([]);
      setFormVisible(false);
      setErrorMessage(null);
    } catch (error) {
      // Handle error
      console.error('Error in handleAddBookmark:', error);
      setErrorMessage('An error occurred while adding the bookmark');
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  

    return (
    <div>
{isCopied && (
        <div className="alert alert-success" role="alert">
          Content copied to clipboard!
        </div>
      )}
    <div className='book'>
      <title>Booking</title>
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" />
      <center><h3 className='mybook'><b>My Bookmarks</b></h3></center>
      
      <div className='tabular' style={{ color: 'rgb(201, 131, 1)' }}>
        <ul>
          {/* Use a button to toggle the form visibility */}
          <button 
            style={{ color: 'rgb(201, 131, 1)' }}
            onClick={toggleFormVisibility}
          > 
            <li> <i className="fas fa-bookmark"></i> {/* Bookmark Icon */}
             
            </li>
          </button>
       {/* Add a button to toggle TagsPopup visibility //tags.js page*/} 
       <button style={{ color: 'rgb(201, 131, 1)' }} onClick={toggleTagsPopupVisibility}>
            <li> <i className="fas fa-tags"></i> {/* Tags Icon */}</li> 
          </button>

          <button style={{ color: 'rgb(201, 131, 1)' }} onClick={toggleSearchPopupVisibility}>
            <li> <i className="fas fa-search"></i> {/* Search Icon */}</li>
          </button>
          <div className='tabular' style={{ color: 'rgb(201, 131, 1)' }}>
     
          {/* ... (existing code) */}
          <button style={{ color: 'rgb(201, 131, 1)' }} onClick={toggleFilterPopupVisibility}>
            <li><i className="fas fa-filter"></i> </li>
          </button>
     
      </div>

    

        </ul>
      </div>
        {/* Display the filter modal if isFilterModalVisible is true */}
        {isFilterPopupVisible && (
        <FilterPopup
          selectedFilter={selectedFilter}
          applyFilter={applyFilter}
          toggleFilterPopupVisibility={toggleFilterPopupVisibility}
        />
      )}
      {/* Display SearchPopup if isSearchPopupVisible is true */}
      {isSearchPopupVisible && (
        <SearchPopup
          closeSearchPopup={toggleSearchPopupVisibility}
          bookmarks={bookmarks}
        />
      )}
         {/* Display TagsPopup if isTagsPopupVisible is true //tags.js page */}
         {isTagsPopupVisible && (
        <TagsPopup
          tags={tags}
          handleRemoveTag={handleRemoveTag}
          handleInputChange={handleInputChange}
          handleInputKeyDown={handleInputKeyDown}
          inputValue={inputValue}
          closeTagsPopup={toggleTagsPopupVisibility}
          suggestedTags={allTags}
        />
      )}
      {isFormVisible && (
        <div className='add-bookmark-form'>
          <h4 className='newbook'>Add New Bookmark</h4>
      <form className='addbm'>
        <div className='mb-3'>
        <label htmlFor="url" className="form-label">
              URL
            </label>
            <input
              type="text"
              className="form-control"
              id="url"
              value={url}
              onChange={(e) => seturl(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
    <label htmlFor="tags" className="form-label">
      Tags
    </label>
    <Select
      isMulti
      options={allTags.map((tag) => ({ value: tag.title, label: tag.title }))}
      value={selectedTags}
      onChange={(selectedOptions) => setSelectedTags(selectedOptions)}
    />
  </div>
        
          <button type="button" className="addbutt"  onClick={handleAddBookmark}>
          
            Add Bookmark
          </button>
          <button
        type="button"
  className="addbutt" 
  onClick={toggleFormVisibility}>
  Close
</button>

      </form>
      {errorMessage && (
      <div className="alert alert-danger" role="alert">
        {errorMessage}
      </div>
    )}
      </div>
      )}
    </div>  
    <div className='existing'>
  {/* Display the list of bookmarks as a table */}
  <table className="table">
    <thead>
      <tr>
        <th>Title</th>
        <th>URL</th>
        <th>Description</th>
        <th>Tags</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
  {currentItems.map((bookmark, index) => (
    <tr key={bookmark.id}>
     
      <td>
  {editingBookmarkIndex === index ? (
    <input
      type="text"
      value={title}
      onChange={(e) => settitle(e.target.value)}
    />
  ) : (
    bookmark.title
  )}
</td>
<td>
  {editingBookmarkIndex === index ? (
    <input
      type="text"
      value={url}
      onChange={(e) => seturl(e.target.value)}
    />
  ) : (
    <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
    {bookmark.url}
    </a>
  )}
</td>

<td>
  {editingBookmarkIndex === index ? (
    <textarea
      value={description}
      onChange={(e) => setdescription(e.target.value)}
    />
  ) : (
    bookmark.description
  )}
</td>
<td>
{editingBookmarkIndex === index ? (
    <input
      type="text"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
    />
  ) : (
    bookmark.tag_title
  )}
</td>


      <td>
        {editingBookmarkIndex === index ? (
          <>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                 // Save changes using an updateBookmark function
              const updatedBookmarks = [...bookmarks];
              updatedBookmarks[index].title = title; // Update the title in the specific bookmark
              updatedBookmarks[index].url = url;
              updatedBookmarks[index].tag_title = tags;
              updatedBookmarks[index].description = description;
              setBookmarks(updatedBookmarks);
              // Update the state to stop editing
              setEditingBookmarkIndex(null);
              handleSaveBookmark(index)
              }}
            >
             <i className="fas fa-save"></i> {/* Save Icon */}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                // Cancel editing and revert changes
                settitle(bookmark.title);
                seturl(bookmark.url);
                setTags(bookmark.tag_title);
                setdescription(bookmark.description)
                setEditingBookmarkIndex(null);
              }}
              
            >
             <i className="fas fa-times"></i>  {/*cancel*/}
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteBookmark(index)}
            >
             <i className="fas fa-trash-alt"></i> {/* Delete Icon */}
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleShareBookmark(index)}
            >
              <i className="fas fa-copy"></i> {/* Copy Icon */}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingBookmarkIndex(index);
                settitle(bookmark.title);
                seturl(bookmark.url);
                setTags(bookmark.tag_title);
                setdescription(bookmark.description)
              }}
            >
             <i className="fas fa-edit"></i> {/* Edit Icon */}
            </button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

  </table>
  <div className="pagination-controls">
          {renderPaginationControls()}
        </div>
</div>
    </div>
  );
};

export default Dash;