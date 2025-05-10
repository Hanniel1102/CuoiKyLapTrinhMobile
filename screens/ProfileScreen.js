import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Ionicons } from '@expo/vector-icons'; // hoặc FontAwesome, MaterialIcons,...

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
      
      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FavoriteList')}>
          <View style={styles.row}>
            <Ionicons name="heart" size={20} color="#1F3C35" style={styles.icon} />
            <Text style={styles.buttonText}>Thư Viện Yêu Thích</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FollowedAuthors')}>
          <View style={styles.row}>
            <Ionicons name="people" size={20} color="#1F3C35" style={styles.icon} />
            <Text style={styles.buttonText}>Danh Sách Tác Giả Đã Theo Dõi</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HistoryScreen')}>
          <View style={styles.row}>
            <Ionicons name="time" size={20} color="#1F3C35" style={styles.icon} />
            <Text style={styles.buttonText}>Lịch Sử Truyện Đã Xem</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostStory')}>
          <View style={styles.row}>
            <Ionicons name="create" size={20} color="#1F3C35" style={styles.icon} />
            <Text style={styles.buttonText}>Đăng Truyện Cá Nhân</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.row}>
            <Ionicons name="log-out" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.logoutText}>Đăng Xuất</Text>
          </View>
        </TouchableOpacity>
        </View>        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1F3C35',
    alignItems: 'center',
    paddingTop: 150,
    paddingHorizontal: 20,
  },
  user :{
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F3C35',
  },
   menu:{
    width: 400,
    height: "100%", 
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute', 
    top: '35%', 
    zIndex: 0,
    paddingTop:150,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    paddingLeft: 30,
    paddingTop:25,
  },
  buttonText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 50,
    padding: 15,
    backgroundColor: '#3B6C58',
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginLeft:30,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },

});

export default ProfileScreen;