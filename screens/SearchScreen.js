import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.194.66:3000/novels'; // Đường dẫn API

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchBooksByTitle = async (title) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?title_like=${encodeURIComponent(title)}`);
      return response.data; // Không có .items hay .volumeInfo
    } catch (error) {   
      console.error('Lỗi khi lấy sách theo tên truyện:', error);
      throw error;
    }
  };
  const fetchBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?authors_like=${encodeURIComponent(author)}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy sách theo tác giả:', error);
      throw error;
    }
  };

  // Hàm tìm kiếm theo từ khóa
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
      const isAuthorSearch = query.includes('author:');
      const searchTerm = isAuthorSearch ? query.replace('author:', '').trim() : query;

      if (isAuthorSearch) {
        books = await fetchBooksByAuthor(searchTerm); // Tìm kiếm theo tác giả
      } else {
        books = await fetchBooksByTitle(searchTerm); // Tìm kiếm theo tên truyện
      }

      console.log('Kết quả tìm kiếm:', books); // Kiểm tra kết quả tìm kiếm

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
        placeholder="Nhập tên truyện hoặc tác giả"
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
                  {book.link_thumbnail ? (
                    <Image source={{ uri: book.link_thumbnail }} style={styles.bookImage} />
                  ) : (
                    <Text>Không có ảnh bìa</Text>
                  )}
                  <View style={styles.bookTextContainer}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookInfo}>
                      Tác giả: {book.authors ? book.authors.join(', ') : 'Chưa có tác giả'}
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
