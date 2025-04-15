import axios from 'axios';

// Hàm để lấy sách mới cập nhật
export const fetchNewlyUpdatedBooks = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=truyện&orderBy=newest');
    return response.data.items || [];
  } catch (error) {
    console.error('Lỗi khi lấy sách mới cập nhật:', error);
    throw error;
  }
};

// Hàm để lấy sách hot gần đây
export const fetchRecentHotBooks = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=truyện&maxResults=10');
    return response.data.items || [];
  } catch (error) {
    console.error('Lỗi khi lấy sách hot gần đây:', error);
    throw error;
  }
};

// Hàm để lấy danh sách tác giả
export const fetchAuthors = async (booksHot) => {
  const authorsList = Array.from(new Set(booksHot.flatMap(book => book.volumeInfo.authors || [])));
  return authorsList;
};
 // Lấy sách theo tác giả
 export const fetchBooksByAuthors = async (author) => {
    try {
      const encodedAuthor = encodeURIComponent(author); // Mã hóa tên tác giả
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodedAuthor}`);
      return response.data.items || [];
    } catch (error) {
      console.error('Lỗi khi lấy sách theo tác giả:', error.response?.data || error.message);
      throw error;
    }
  };

// Hàm để lấy danh sách thể loại
export const fetchCategories = async (booksHot) => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes?q=truyện');
      const books = response.data.items || [];
  
      // Lấy danh sách các thể loại từ các sách
      const categoriesList = Array.from(new Set(books.flatMap(book => book.volumeInfo.categories || [])));
      return categoriesList;
    } catch (error) {
      console.error('Lỗi khi lấy thể loại:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Lấy sách theo thể loại
  export const fetchBooksByCategory = async (category) => {
    try {
      const encodedCategory = encodeURIComponent(category);
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=truyện:${encodedCategory}`);
      return response.data.items || [];
    } catch (error) {
      console.error('Lỗi khi lấy sách:', error.response?.data || error.message);
      throw error;
    }
  };