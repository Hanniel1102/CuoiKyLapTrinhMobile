import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Đường dẫn Google Books API
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Hàm tìm kiếm theo tên truyện
  const fetchBooksByTitle = async (title) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${title}`);
      return response.data.items || [];
    } catch (error) {
      console.error('Lỗi khi lấy sách theo tên truyện:', error);
      throw error;
    }
  };

  // Hàm tìm kiếm theo tác giả
  const fetchBooksByAuthor = async (author) => {
    try {
      const encodedAuthor = encodeURIComponent(author); // Mã hóa tên tác giả
      const response = await axios.get(`${API_BASE_URL}inauthor:${encodedAuthor}`);
      return response.data.items || [];
    } catch (error) {
      console.error('Lỗi khi lấy sách theo tác giả:', error);
      throw error;
    }
  };

  // Hàm tìm kiếm theo từng ký tự nhập vào
  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]); // Nếu không có từ khóa tìm kiếm, không hiển thị kết quả
      setLoading(false);
      return;
    }

    try {
      let books = [];
      
      // Kiểm tra xem có phải tìm kiếm theo tác giả không (thêm dấu `author:` để tìm theo tác giả)
      const isAuthorSearch = query.includes('author:');
      const searchTerm = isAuthorSearch ? query.replace('author:', '').trim() : query;

      if (isAuthorSearch) {
        // Tìm kiếm theo tác giả
        books = await fetchBooksByAuthor(searchTerm);
      } else {
        // Tìm kiếm theo tên truyện
        books = await fetchBooksByTitle(searchTerm);
      }

      setSearchResults(books);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      setLoading(false);
    }
  };

  // Hàm khi nhấn vào một cuốn sách, điều hướng đến màn hình chi tiết
  const handleBookPress = (book) => {
    navigation.navigate('Detail', { book });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm Kiếm Truyện</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập tên truyện hoặc tác giả (Ví dụ: author:J.K. Rowling)"
        value={searchQuery}
        onChangeText={(text) => handleSearch(text)} // Tìm kiếm khi thay đổi văn bản
        placeholderTextColor="#888"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((book, index) => (
              <TouchableOpacity key={index} style={styles.bookItem} onPress={() => handleBookPress(book)}>
                <View style={styles.bookContent}>
                  {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? (
                    <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.bookImage} />
                  ) : (
                    <Text>Không có ảnh bìa</Text>
                  )}
                  <View style={styles.bookTextContainer}>
                    <Text style={styles.bookTitle}>{book.volumeInfo.title}</Text>
                    <Text style={styles.bookInfo}>
                      Tác giả: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Chưa có tác giả'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>Không tìm thấy kết quả.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  resultsContainer: {
    flex: 1,
  },
  bookItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 15,
    borderRadius: 4,
  },
  bookTextContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookInfo: {
    fontSize: 14,
    color: '#777',
  },
  noResults: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
