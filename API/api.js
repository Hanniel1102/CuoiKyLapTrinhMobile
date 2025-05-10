import axios from 'axios';

// const BASE_URL = 'http://192.168.194.66:3000/novels'; // API nội bộ của bạn
const BASE_URL = 'http://192.168.1.7:3000/novels'; // API nội bộ của bạn

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
    return books.sort((a, b) => b.view_count - a.view_count); // Lấy 10 sách hot nhất
  } catch (error) {
    console.error('Lỗi khi lấy sách hot gần đây:', error);
    throw error;
  }
};

// Hàm để lấy danh sách thông tin tác giả và loại bỏ các tác giả trùng tên
export const fetchAuthors = async (books) => {
  const authorsList = books.flatMap(book => 
    book.authors?.map(author => ({
      name: author.name,
      birth: author.birth,
      pic: author.pic,
    })) || []
  );

  // Dùng Map để loại bỏ các tác giả trùng tên
  const uniqueAuthorsMap = new Map();
  authorsList.forEach(author => {
    if (!uniqueAuthorsMap.has(author.name)) {
      uniqueAuthorsMap.set(author.name, author); // Thêm tác giả vào Map nếu chưa có
    }
  });
  
  // Trả về danh sách các tác giả không trùng tên
  return Array.from(uniqueAuthorsMap.values());
};


// Lấy sách theo tác giả
export const fetchBooksByAuthors = async (authorName) => {
  try {
    const response = await axios.get(BASE_URL);
    const books = response.data || [];
    
    // Lọc sách dựa trên tên tác giả
    return books.filter(book =>
      book.authors?.some(author => 
        author.name.toLowerCase().includes(authorName.toLowerCase()) // Kiểm tra tên tác giả có chứa từ khóa
      )
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
export const fetchBooksByTitle = async (title) => {
  try {
    // Gọi API để tìm sách theo tên truyện
    const response = await axios.get(`${BASE_URL}`, {
      params: { title: title } // Truyền tham số title vào URL
    });

    // Trả về danh sách sách nếu có kết quả
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy sách theo tên truyện:', error);
    throw error;
  }
};


// Hàm tìm kiếm tác giả
export const fetchAuthor = async (authorName) => {
  try {
    // Gọi API để tìm tác giả
    const response = await axios.get(`${BASE_URL}`, {
      params: { authors: authorName } // Truyền tham số authors vào URL
    });

    // Trả về danh sách tác giả nếu có kết quả
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi tìm tác giả:', error);
    throw error;
  }
};
