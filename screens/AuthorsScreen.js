import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const BooksByAuthors = ({ route, navigation }) => {
  const { author, books } = route.params || {};  // Lấy tác giả và sách từ params, sử dụng default empty object
  const [bookList, setBookList] = useState(books || []); // Lưu sách theo tác giả vào state
  const [followedAuthors, setFollowedAuthors] = useState([]); // Lưu danh sách tác giả đã theo dõi
  const [username, setUsername] = useState(''); // Lưu tên người dùng

  // Tính tổng số lượt đọc của các sách
  const totalViews = bookList.reduce((total, book) => total + (book.view_count || 0), 0);

  // Lấy danh sách tác giả đã theo dõi từ AsyncStorage khi component load
 useEffect(() => {
    const getFollowedAuthors = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername); // Lưu username vào state

        if (storedUsername) {
          const followed = await AsyncStorage.getItem(`followedAuthors_${storedUsername}`);
          if (followed) {
            setFollowedAuthors(JSON.parse(followed)); // Cập nhật lại danh sách tác giả đã theo dõi
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tác giả đã theo dõi:', error);
      }
    };

    getFollowedAuthors();
  }, []);

  // Render mỗi sách với hình ảnh thumbnail và tên
  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Detail', { book: item })} // Điều hướng tới DetailScreen khi nhấn vào sách
    >
      {item && item.link_thumbnail ? (
        <Image source={{ uri: item.link_thumbnail }} style={styles.bookImage} />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.bookTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Xử lý việc theo dõi tác giả
  const handleFollowAuthor = async (author) => {
  if (!username) {
    Alert.alert('Thông báo', 'Bạn cần đăng nhập để thêm sách vào yêu thích.');
    return;
  }
  try {
    const authorName = author.name;
    // Kiểm tra xem tác giả đã có trong danh sách yêu thích chưa
    const isFollowed = followedAuthors.some(followedAuthor => followedAuthor === authorName);
    
    if (isFollowed) {
      // Nếu tác giả đã được theo dõi, xóa khỏi danh sách
      const updatedFollowedAuthors = followedAuthors.filter(item => item !== authorName);
      setFollowedAuthors(updatedFollowedAuthors);
      await AsyncStorage.setItem(`followedAuthors_${username}`, JSON.stringify(updatedFollowedAuthors));
      console.log(`${authorName} đã được bỏ theo dõi.`);
    } else {
      // Nếu tác giả chưa được theo dõi, thêm vào danh sách
      const updatedFollowedAuthors = [...followedAuthors, authorName];
      setFollowedAuthors(updatedFollowedAuthors);
      await AsyncStorage.setItem(`followedAuthors_${username}`, JSON.stringify(updatedFollowedAuthors));
    }

  } catch (error) {
    console.error('Lỗi khi thao tác với yêu thích:', error);
    Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thao tác với yêu thích.');
  }
};

  return (
    <View style={styles.container}>
      {/* Thông tin tác giả */}
      <View style={styles.authorInfo}>
        {author && author.pic ? (
          <Image source={{ uri: author.pic }} style={styles.authorImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.authorDetails}>
          <Text style={styles.authorName}>{author ? author.name : 'Unknown'}</Text>
          <Text style={styles.authorBirth}>Ngày sinh: {author ? author.birth : 'N/A'}</Text>
        </View>
      </View>

      {/* Nút theo dõi */}
      <TouchableOpacity
        style={[styles.followButton, followedAuthors.includes(author.name) && styles.followedButton]}
        onPress={() => handleFollowAuthor(author)}
      >
        <Text style={styles.followButtonText}>
          {followedAuthors.includes(author.name) ? 'Bỏ theo dõi' : 'Theo dõi'}
        </Text>
      </TouchableOpacity>

      {/* Danh sách sách của tác giả */}
      <View style={styles.bookListContainer}>
        <Text style={styles.title}>Sách của {author ? author.name : 'Tác giả'}</Text>
        <Text style={styles.totalViews}>Tổng số lượt đọc: {totalViews}</Text>
        {bookList && bookList.length > 0 ? (
          <FlatList
            data={bookList}
            renderItem={renderBookItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2} // Hiển thị 2 cột
            contentContainerStyle={styles.bookList}
          />
        ) : (
          <Text style={styles.noBooksText}>Không có sách nào của tác giả này.</Text>
        )}
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
    elevation: 3,
    marginTop: 30,
  },

  authorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },

  noImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },

  noImageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
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

  // Nút theo dõi
  followButton: {
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  followedButton: {
    backgroundColor: '#aaa',
  },

  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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

  bookListContainer: {
    flex: 1,
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
