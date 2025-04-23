import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const BooksByAuthors = ({ route ,navigation}) => {
  const { author, books } = route.params;  // Lấy tác giả và sách từ params
  const [bookList, setBookList] = useState(books || []); // Lưu sách theo tác giả vào state

  const totalViews = bookList.reduce((total, book) => total + (book.view_count || 0), 0);

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
      {/* Thông tin tác giả */}
      <View style={styles.authorInfo}>
        <Image source={{ uri: author.pic }} style={styles.authorImage} />
        <View style={styles.authorDetails}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.authorBirth}>Ngày sinh: {author.birth}</Text>
        </View>
      </View>

      {/* Danh sách sách của tác giả */}
      <View style={styles.container}>
        <Text style={styles.title}>Sách của {author.name}</Text>
        <Text style={styles.totalViews}>Tổng số lượt đọc: {totalViews}</Text>
        <FlatList
          data={bookList}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Hiển thị 2 cột
          contentContainerStyle={styles.bookList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  // Phần thông tin tác giả
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Tạo hiệu ứng bóng đổ
    marginTop: 30, // Đẩy phần thông tin tác giả xuống dưới (30 là giá trị ví dụ)
  },

  authorImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Hình tròn
    marginRight: 20, // Khoảng cách giữa ảnh và thông tin
  },

  authorDetails: {
    flexDirection: 'column',
  },

  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  authorBirth: {
    fontSize: 14,
    color: '#555',
  },

  // Phần hiển thị tổng số lượt đọc
  totalViews: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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

  noBooksText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default BooksByAuthors;
