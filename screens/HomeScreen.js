import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchNewlyUpdatedBooks, fetchRecentHotBooks, fetchAuthors, fetchCategories, fetchBooksByAuthors } from '../API/api.js'; // Import API cần thiết

// Component tái sử dụng cho hiển thị sách
const BookItem = ({ book }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.book} onPress={() => navigation.navigate('Detail', { book })}>
      {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? (
        <Image
          source={{ uri: book.volumeInfo.imageLinks.thumbnail }}
          style={styles.bookImage}
        />
      ) : (
        <Text>Không có hình ảnh</Text>
      )}
      <Text style={styles.bookTitle}>{book.volumeInfo.title}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const [newlyUpdatedBooks, setNewlyUpdatedBooks] = useState([]);
  const [recentHotBooks, setRecentHotBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation(); // Hook điều hướng

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const query = searchQuery.trim() === '' ? 'fiction' : searchQuery;

      try {
        // Fetch newly updated books
        const booksNew = await fetchNewlyUpdatedBooks();
        setNewlyUpdatedBooks(booksNew);

        // Fetch recent hot books
        const booksHot = await fetchRecentHotBooks();
        setRecentHotBooks(booksHot);

        // Get unique authors
        const authorsList = await fetchAuthors(booksHot);
        setAuthors(authorsList);

        // Get unique categories
        const categoriesList = await fetchCategories(booksHot);
        setCategories(categoriesList);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  // Hàm lấy sách theo tác giả khi tác giả được chọn
  const handleAuthorPress = async (author) => {
    setLoading(true); // Hiển thị loading khi đang lấy sách
    try {
      const booksByAuthor = await fetchBooksByAuthors(author); // Lấy sách theo tác giả
      setLoading(false);
      // Điều hướng đến màn hình 'BooksByAuthor' và truyền dữ liệu sách của tác giả
      navigation.navigate('BooksByAuthors', { author, books: booksByAuthor });
    } catch (error) {
      console.error('Lỗi khi lấy sách của tác giả:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sách"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholderTextColor="#888"
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sách Mới Cập Nhật</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {newlyUpdatedBooks.map((book, index) => (
                <BookItem key={index} book={book} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sách Hot Gần Đây</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {recentHotBooks.map((book, index) => (
                <BookItem key={index} book={book} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tác Giả Nổi Bật</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {authors.map((author, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.author}
                  onPress={() => handleAuthorPress(author)} // Gọi hàm khi nhấn vào tác giả
                >
                  <Text style={styles.authorName}>{author}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thể Loại Nổi Bật</Text>
          <View style={styles.categoriesList}>
            {categories.map((category, index) => (
              <View key={index} style={styles.category}>
                <Text style={styles.categoryName}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookContainer: {
    flexDirection: 'row',
  },
  book: {
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginBottom: 10,
    borderRadius: 4,
  },
  author: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  authorName: {
    fontSize: 14,
    textAlign: 'center',
  },
  categoriesList: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  category: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
