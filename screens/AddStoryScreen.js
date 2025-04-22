import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker để chọn ảnh từ thiết bị
import { useNavigation } from '@react-navigation/native';

const AddStoryScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(''); // Tên tác giả
  const [thumbnail, setThumbnail] = useState(''); // Ảnh thumbnail
  const [username, setUsername] = useState(''); // Tên người dùng
  const navigation = useNavigation();

  // Lấy tên người dùng từ AsyncStorage khi component được tải
  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername); // Lưu username vào state
      setAuthor(storedUsername); // Cập nhật tên tác giả bằng tên người dùng
    };

    getUsername(); // Kiểm tra khi component được render
  }, []);

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri); // Cập nhật ảnh thumbnail
    }
  };

  const handleAddStory = async () => {
    if (title === '' || description === '' || author === '' || !thumbnail ) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newStory = { title, description, author, thumbnail};

    try {
      // Lấy danh sách truyện hiện tại trong AsyncStorage cho người dùng hiện tại
      const currentStories = await AsyncStorage.getItem(`stories_${username}`);
      let updatedStories = [];

      if (currentStories) {
        updatedStories = JSON.parse(currentStories);
      }

      // Thêm truyện mới vào danh sách
      updatedStories.push(newStory);

      // Lưu lại danh sách truyện đã được cập nhật vào AsyncStorage cho người dùng hiện tại
      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(updatedStories));

      // Thông báo đăng truyện thành công
      Alert.alert('Thông báo', 'Truyện đã được đăng thành công!');

      // Xóa các trường nhập liệu sau khi đăng
      setTitle('');
      setDescription('');
      setAuthor('');
      setThumbnail('');
      navigation.navigate('PostStory'); // Chuyển hướng sau khi đăng truyện

    } catch (error) {
      console.error('Error saving story to AsyncStorage', error);
      Alert.alert('Lỗi', 'Không thể đăng truyện, vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng Truyện Mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tiêu đề truyện"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Tác giả"
        value={author} // Tên tác giả được tự động điền
        onChangeText={setAuthor}
      />

      <View style={styles.thumbnailContainer}>
        {/* Hiển thị ảnh thumbnail bên trái button chọn ảnh */}
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
        ) : null}

        {/* Button chọn ảnh thumbnail */}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Chọn Ảnh Thumbnail</Text>
        </TouchableOpacity>
      </View>

      {/* Button Đăng truyện mới */}
      <TouchableOpacity style={styles.button} onPress={handleAddStory}>
        <Text style={styles.buttonText}>Tạo Truyện</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
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
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Đảm bảo ảnh và nút nằm ngang
    marginBottom: 10,
  },
  thumbnailImage: {
    width: 220, // Kích thước ảnh rộng 300px
    height: 400, // Kích thước ảnh cao 500px
    marginRight: 5, // Khoảng cách giữa ảnh và nút
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Thêm viền nhẹ cho ảnh
  },
});

export default AddStoryScreen;
