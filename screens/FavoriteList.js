import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteList = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]); // Danh sách sách yêu thích
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [username, setUsername] = useState(''); // Lưu tên đăng nhập của người dùng

  // Lấy sách yêu thích từ AsyncStorage
  useEffect(() => {
    const getFavoriteBooks = async () => {
      try {
        const username = await AsyncStorage.getItem('username'); // Lấy username từ AsyncStorage
        if (username) {
          const storedFavorites = await AsyncStorage.getItem(`favoriteBooks_${username}`); // Lấy danh sách yêu thích của user từ AsyncStorage
          const userFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
          setFavoriteBooks(userFavorites); // Cập nhật lại danh sách yêu thích của người dùng
        } else {
          setFavoriteBooks([]); // Nếu không có username, không hiển thị yêu thích
        }
      } catch (error) {
        console.error('Lỗi khi lấy sách yêu thích:', error);
      }
      setLoading(false); // Đổi trạng thái loading khi đã lấy xong dữ liệu
    };

    getFavoriteBooks();
  }, []); // Gọi effect khi component mount

  // Hàm để xóa sách khỏi danh sách yêu thích
  const removeFromFavorites = async (item) => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để thao tác với danh sách yêu thích.');
        return;
      }

      const storedFavorites = await AsyncStorage.getItem(`favoriteBooks_${username}`);
      const userFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      const updatedFavorites = userFavorites.filter(book => book.id !== item.id);

      await AsyncStorage.setItem(`favoriteBooks_${username}`, JSON.stringify(updatedFavorites));

      setFavoriteBooks(updatedFavorites);
      Alert.alert('Thành công', 'Sách đã được bỏ khỏi danh sách yêu thích.');
    } catch (error) {
      console.error('Lỗi khi xóa sách yêu thích:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xóa sách yêu thích.');
    }
  };

  // Hàm render mỗi sách trong danh sách yêu thích
  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.authors?.map(author => author.name).join(', ')  ||'Tác giả chưa được cập nhật'}</Text>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item)} // Xóa sách khỏi yêu thích khi nhấn
      >
        <Text style={styles.removeButtonText}>Xóa khỏi yêu thích</Text>
      </TouchableOpacity>
    </View>
  );

  // Nếu đang loading, hiển thị vòng tròn loading
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sách Yêu Thích</Text>
      {favoriteBooks.length === 0 ? (
        <Text style={styles.noFavoritesText}>Bạn chưa có sách yêu thích nào!</Text>
      ) : (
        <FlatList
          data={favoriteBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id ? item.id.toString() : 'no-id'} 
        />
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  bookItem: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#888',
  },
  removeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteList;
