import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { fetchBooksByAuthors } from '../API/api'; // Đảm bảo bạn đã khai báo hàm fetchBooksByAuthors trong API

const AuthorList = ({ route, navigation }) => {
  const { authors } = route.params; // Lấy danh sách tác giả từ params
  const [loading, setLoading] = useState(false);
  const [followedAuthors, setFollowedAuthors] = useState([]); // Danh sách các tác giả đã theo dõi
  const [username, setUsername] = useState(''); // Lưu tên người dùng

  // Lấy danh sách các tác giả đã theo dõi từ AsyncStorage khi component được tải
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

  const handleAuthorPress = async (author) => {
    setLoading(true);
    const authorName = author.name;
    if (typeof authorName !== 'string' || authorName.trim() === '') {
      console.error('authorName không phải là chuỗi hợp lệ:', authorName);
      setLoading(false);
      return;
    }

    try {
      const booksByAuthor = await fetchBooksByAuthors(authorName); // Gọi hàm với authorName
      setLoading(false);
      navigation.navigate('BooksByAuthors', { author, books: booksByAuthor });
    } catch (error) {
      console.error('Lỗi khi lấy sách của tác giả:', error);
      setLoading(false);
    }
  };

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
      <Text style={styles.title}>Danh Sách Tác Giả</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <ScrollView style={styles.authorList}>
          
          {authors.map((author, index) => (
            <TouchableOpacity onPress={() => handleAuthorPress(author)}>
            <View key={index} style={styles.authorItem}>
              {author.pic ? (
                <Image source={{ uri: author.pic }} style={styles.authorImage} />
              ) : (
                <View style={styles.noImageContainer}>
                  <Text style={styles.noImageText}>No Image</Text>
                </View>
              )}

              <Text style={styles.authorName}>{author.name}</Text>
              <TouchableOpacity
                style={[styles.followButton, followedAuthors.includes(author.name) && styles.followedButton]}
                onPress={() => handleFollowAuthor(author)}
              >
                <Text style={styles.followButtonText}>
                  {followedAuthors.includes(author.name) ? 'Bỏ theo dõi' : 'Theo dõi'}
                </Text>
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          ))}
          
        </ScrollView>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  authorList: {
    marginBottom: 20,
  },
  authorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  noImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginRight: 10,
  },
  noImageText: {
    color: '#888',
  },
  authorName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  followButton: {
    backgroundColor: '#008080',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  followedButton: {
    backgroundColor: '#ff6347', // Màu đỏ khi đã theo dõi
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AuthorList;
