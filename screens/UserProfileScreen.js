import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker để chọn ảnh từ thiết bị
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import { useNavigation } from '@react-navigation/native'; // Để điều hướng

const UserProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null); // State để lưu avatar
  const navigation = useNavigation(); // Hook điều hướng

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('username');
        const userEmail = await AsyncStorage.getItem('email');
        const userAvatar = await AsyncStorage.getItem('avatar'); // Lấy avatar nếu có
        const userGender = await AsyncStorage.getItem('gender'); // Get gender if stored

        if (user) setUsername(user);
        if (userEmail) setEmail(userEmail);
        if (userGender) setGender(userGender); // Set gender value
        if (userAvatar) setAvatar(userAvatar); // Set avatar if available
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage', error);
      }
    };

    getUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Save updated information to AsyncStorage
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('avatar', avatar); // Save avatar if changed
      await AsyncStorage.setItem('gender', gender); // Save gender

      // Thông báo thành công
      Alert.alert('Thông báo', 'Thông tin đã được cập nhật!');

      // Quay lại trang ProfileScreen sau khi lưu
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  const pickImage = async () => {
    // Yêu cầu quyền truy cập vào ảnh từ thiết bị
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Hình vuông để làm avatar
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri); // Cập nhật avatar với ảnh người dùng chọn
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông Tin Cá Nhân</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || 'https://www.w3schools.com/w3images/avatar2.png' }} // Avatar mặc định nếu không có ảnh
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
          <Text style={styles.avatarButtonText}>Chọn Ảnh</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên Đăng Nhập"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Gender Dropdown */}
      <Text style={styles.inputLabel}>Giới Tính</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Chọn giới tính" value="" />
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
          <Picker.Item label="Khác" value="Khác" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Lưu Thay Đổi</Text>
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
    marginBottom: 20,
    color: '#333',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Tạo hình tròn cho avatar
    marginBottom: 10,
  },
  avatarButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfileScreen;
