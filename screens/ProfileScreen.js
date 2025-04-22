import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');  // Avatar state
  const navigation = useNavigation();

  useEffect(() => {
    // Lấy tên đăng nhập từ AsyncStorage khi component được load
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('username');
        const userAvatar = await AsyncStorage.getItem('avatar');  // Lấy avatar từ AsyncStorage

        if (user) {
          setUsername(user);
        }
        if (userAvatar) {
          setAvatar(userAvatar);
        } else {
          setAvatar('https://www.w3schools.com/w3images/avatar2.png');  // Đặt ảnh mặc định nếu không có avatar
        }
      } catch (error) {
        console.error('Error fetching username from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    // Hiển thị thông báo khi người dùng nhấn nút Đăng xuất
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: () => {
            // Thực hiện đăng xuất (Có thể xóa token, xóa session, vv...)
            console.log('User logged out');
            navigation.navigate('Welcome'); // Quay lại màn hình chào mừng (hoặc màn hình login)
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.user} onPress={() => navigation.navigate('UserProfileScreen')}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.header} >
          {username ? username : 'User'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FavoriteList')}
      >
        <Text style={styles.buttonText}>Thư Viện Yêu Thích</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FollowedAuthors')}
      >
        <Text style={styles.buttonText}>Danh Sách Tác Giả Đã Theo Dõi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HistoryScreen')}
      >
        <Text style={styles.buttonText}>Lịch Sử Truyện Đã Xem</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PostStory')}
      >
        <Text style={styles.buttonText}>Đăng Truyện Cá Nhân</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  user :{
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Đảm bảo avatar là hình tròn
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProfileScreen;
