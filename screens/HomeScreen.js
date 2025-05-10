import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { fetchNewlyUpdatedBooks, fetchRecentHotBooks, fetchAuthors, fetchCategories, fetchBooksByCategory, fetchBooksByAuthors } from '../API/api.js';

const BookItem = ({ book }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  const handleBookPress = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    if (!username) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu lịch sử!');
      return;
    }

    const history = await AsyncStorage.getItem(`history_${username}`);
    const parsedHistory = history ? JSON.parse(history) : [];

    // Kiểm tra truyện đã tồn tại chưa
    const exists = parsedHistory.some(item => item.id === book.id); // hoặc so sánh bằng title nếu không có id
    if (!exists) {
      const updatedHistory = [...parsedHistory, book];
      await AsyncStorage.setItem(`history_${username}`, JSON.stringify(updatedHistory));
    }

    navigation.navigate('Detail', { book });
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

  const imageUrl = book?.link_thumbnail || book?.thumbnail || 'https://via.placeholder.com/100x150'; 
  return (
    <TouchableOpacity style={styles.book} onPress={handleBookPress}>
      <Image
        source={{ uri: imageUrl }} 
        style={styles.bookImage}
      />
      <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
        {book?.title || 'Không có tiêu đề'}
      </Text>
    </TouchableOpacity>
  );
};
const HomeScreen = () => {
  const [newlyUpdatedBooks, setNewlyUpdatedBooks] = useState([]);
  const [recentHotBooks, setRecentHotBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const booksNew = await fetchNewlyUpdatedBooks();
        setNewlyUpdatedBooks(booksNew);

        const booksHot = await fetchRecentHotBooks();
        setRecentHotBooks(booksHot);
        
        const authorsList = await fetchAuthors(booksHot);
        setAuthors(authorsList.slice(0, 6)); // hiển thị 6 cái ở Home
        setAllAuthors(authorsList);

        const categoriesList = await fetchCategories(booksHot);
        setCategories(categoriesList.slice(0, 5)); 

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setLoading(false);
      }
    };

    const fetchUserStories = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (!username) {
          Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem truyện đã đăng!');
          setLoading(false);
          return;
        }

        const savedStories = await AsyncStorage.getItem(`stories_${username}`);
        if (savedStories) {
          setUserStories(JSON.parse(savedStories)); 
        }
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy truyện của người dùng:', error);
        setLoading(false);
      }
    };

    fetchBooks();
    fetchUserStories(); 

  }, []); 

  // Hàm lấy sách theo tác giả khi tác giả được chọn
  const handleAuthorPress = async (author) => {
    setLoading(true); 
    try {
      const booksByAuthor = await fetchBooksByAuthors(author.name); 
      setLoading(false);
      navigation.navigate('BooksByAuthors', { author, books: booksByAuthor });
    } catch (error) {
      console.error('Lỗi khi lấy sách của tác giả:', error);
      setLoading(false);
    }
  };

  // Fetch sách theo thể loại khi thể loại được chọn
  const handleCategoryPress = async (category) => {
    setLoading(true);
    try {
      const books = await fetchBooksByCategory(category);
      setLoading(false);

      navigation.navigate('BooksByCategory', { category, books });
    } catch (error) {
      console.error('Lỗi khi lấy sách:', error);
      setLoading(false);
    }
  };

  const handleViewAllAuthors = () => {
    navigation.navigate('AuthorList', { authors: allAuthors });
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truyện Mới Cập Nhật</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {newlyUpdatedBooks.length > 0 ? (
                newlyUpdatedBooks.map((book, index) => (
                  <BookItem key={index} book={book} />
                ))
              ) : (
                <Text>Chưa có truyện mới cập nhật!</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truyện Hot Gần Đây</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {recentHotBooks.length > 0 ? (
                recentHotBooks.map((book, index) => (
                  <BookItem key={index} book={book} />
                ))
              ) : (
                <Text>Chưa có truyện hot gần đây!</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truyện Được Đăng Bởi Người Dùng</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {userStories.length > 0 ? (
                userStories.map((story, index) => (
                  <BookItem key={index} book={story} />
                ))
              ) : (
                <Text>Chưa có truyện nào được đăng!</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thể Loại Nổi Bật</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookContainer}>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.author}
                    onPress={() => handleCategoryPress(category)} 
                  >
                    <Text style={styles.authorName}>{category}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Chưa có thể loại nổi bật!</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tác Giả Nổi Bật</Text>
          <View style={styles.authorList}>
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.authorItem}
                  onPress={() => handleAuthorPress(author)} 
                >
                  <Image
                    source={{ uri: author.pic || 'https://via.placeholder.com/60' }}
                    style={styles.authorImage}
                  />
                  <Text style={styles.authorName}>{author.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Chưa có tác giả nổi bật!</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleViewAllAuthors}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
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
    height: 230,
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
  authorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  authorItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  authorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  author: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 5,
  },
  authorName: {
    fontSize: 14,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAll: {
    color: '#FF6347',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
