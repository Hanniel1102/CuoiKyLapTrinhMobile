import axios from 'axios';

const BASE_URL = 'http://192.168.194.66:3000/novels'; // API nội bộ của bạn

// Hàm để lấy sách mới cập nhật
export const fetchNewlyUpdatedBooks = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy sách mới cập nhật:', error);
    throw error;
  }
};

// Hàm để lấy sách hot gần đây (ví dụ: theo view_count)
export const fetchRecentHotBooks = async () => {
  try {
    const response = await axios.get(BASE_URL);
    const books = response.data || [];
    // Sắp xếp theo view_count giảm dần
    return books.sort((a, b) => b.view_count - a.view_count).slice(0, 10);
  } catch (error) {
    console.error('Lỗi khi lấy sách hot gần đây:', error);
    throw error;
  }
};

// Hàm để lấy danh sách tác giả
export const fetchAuthors = async (books) => {
  const authorsList = Array.from(
    new Set(books.flatMap(book => book.authors || []))
  );
  return authorsList;
};

// Lấy sách theo tác giả
export const fetchBooksByAuthors = async (authors) => {
  try {
    const response = await axios.get(BASE_URL);
    const books = response.data || [];
    return books.filter(book =>
      book.authors?.some(a => a.toLowerCase().includes(authors.toLowerCase()))
    );
  } catch (error) {
    console.error('Lỗi khi lấy sách theo tác giả:', error.message);
    throw error;
  }
};

// Lấy danh sách thể loại
export const fetchCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    const books = response.data || [];
    const categoriesList = Array.from(
      new Set(books.flatMap(book => book.categories || []))
    );
    return categoriesList;
  } catch (error) {
    console.error('Lỗi khi lấy thể loại:', error.message);
    throw error;
  }
};

// Lấy sách theo thể loại
export const fetchBooksByCategory = async (category) => {
  try {
    const response = await axios.get(BASE_URL);
    const books = response.data || [];
    return books.filter(book =>
      book.categories?.some(c => c.toLowerCase().includes(category.toLowerCase()))
    );
  } catch (error) {
    console.error('Lỗi khi lấy sách theo thể loại:', error.message);
    throw error;
  }
};

// Hàm tìm kiếm theo tên truyện
// export const fetchBooksByTitle = async (title) => {
//   try {
//     const encodedTitle = encodeURIComponent(title); // Mã hóa tên truyện
//     // Nếu API hỗ trợ tìm kiếm theo query 'title'
//     const response = await axios.get(`${BASE_URL}?title=${encodedTitle}`);
//     return response.data || []; // Trả về danh sách sách
//   } catch (error) {
//     console.error('Lỗi khi lấy sách theo tên truyện:', error);
//     throw error;
//   }
// };

// // Hàm tìm kiếm theo tác giả
// export const fetchBooksByAuthor = async (author) => {
//   try {
//     const encodedAuthor = encodeURIComponent(author); // Mã hóa tên tác giả
//     // Nếu API hỗ trợ tìm kiếm theo query 'inauthor'
//     const response = await axios.get(`${BASE_URL}?authors=${encodedAuthor}`);
//     return response.data || []; // Trả về danh sách sách
//   } catch (error) {
//     console.error('Lỗi khi lấy sách theo tác giả:', error);
//     throw error;
//   }
// };