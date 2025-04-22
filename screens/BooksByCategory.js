import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { fetchBooksByCategory } from '../API/api';  // Import hàm fetchBooksByCategory từ api.js

const BooksByCategory = ({ route, navigation }) => {
  const { category } = route.params; // Nhận thể loại từ tham số điều hướng
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const booksByCategory = await fetchBooksByCategory(category);  // Sử dụng hàm fetch từ api.js
        setBooks(booksByCategory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books by category:', error);
        setLoading(false);
      }
    };

    getBooks();
  }, [category]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Detail', { book: item })} // Điều hướng tới DetailScreen khi nhấn vào sách
    >
      <Image
        source={{ uri: item.link_thumbnail }}
        style={styles.bookImage}
      />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.authors?.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books in {category}</Text>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Chia sách thành 2 cột
        columnWrapperStyle={styles.columnWrapper} // Điều chỉnh khoảng cách giữa các cột
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookItem: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5, // Khoảng cách giữa các item
  },
  bookImage: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 12,
    color: '#555',
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BooksByCategory;
