import axios from 'axios';

const API_BASE_URL = 'http://localhost:6003';

export const fetchBookmarks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/book`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('token')
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

export const addBookmark = async (bookmarkData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createbooks`, bookmarkData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('token')
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};
//   export const editBookmark = async (bookmarkId, updatedBookmark) => {
//     const response = await axios.put(`${API_BASE_URL}/updatebooks/${bookmarkId}`, updatedBookmark);
//     return response.data;

//  }

export const updateBookmarkApi = async (bookmarkData) => {
  try {
    const { id } = bookmarkData;
    const response = await axios.put(`http://localhost:6003/update/${id}`, bookmarkData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
     
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('token')
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTag = async (newTag) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addtags`, newTag, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('token')
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
};
export const deleteBookmarkApi = async (bookmarkId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delbook/${bookmarkId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};