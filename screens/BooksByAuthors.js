import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const BooksByAuthors = ({ route ,navigation}) => {
  const { author, books } = route.params;  // Lấy tác giả và sách từ params
  const [bookList, setBookList] = useState(books || []); // Lưu sách theo tác giả vào state

  // Render mỗi sách với hình ảnh thumbnail và tên
  const renderBookItem = ({ item }) => (
    <TouchableOpacity
          style={styles.bookItem}
          onPress={() => navigation.navigate('Detail', { book: item })} // Điều hướng tới DetailScreen khi nhấn vào sách
        >
      {item && item.link_thumbnail ? (
        <Image
          source={{ uri: item.link_thumbnail }}
          style={styles.bookImage}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.bookTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sách của {author}</Text>
      <FlatList
        data={bookList}
        renderItem={renderBookItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Hiển thị 2 cột
        contentContainerStyle={styles.bookList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookList: {
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  bookItem: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 4,
    marginBottom: 10,
  },
  noImageContainer: {
    width: 100,
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 12,
    color: '#555',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default BooksByAuthors;
