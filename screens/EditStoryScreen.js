import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Button,
  StyleSheet,
  View,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Nhập Picker
import * as ImagePicker from 'expo-image-picker'; // Sử dụng thư viện expo-image-picker
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditStoryScreen = ({ route, navigation }) => {
  const { story, onUpdateSuccess } = route.params;
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [category, setCategory] = useState('');  // Khởi tạo state category
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    if (story) {
      setNewTitle(story.title || '');
      setNewDescription(story.description || '');
      setCategory(story.category || '');  // Gán giá trị thể loại vào state
      setImageUri(story.thumbnail || '');
    }
  }, [story]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Cập nhật ảnh thumbnail khi chọn ảnh mới
    }
  };

  const updateStoryInStorage = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) return Alert.alert('Lỗi', 'Không tìm thấy username.');

      const savedStories = await AsyncStorage.getItem(`stories_${username}`);
      const stories = savedStories ? JSON.parse(savedStories) : [];

      const index = stories.findIndex(item => item.id === story.id);
      if (index === -1) return Alert.alert('Lỗi', 'Không tìm thấy truyện.');

      // Cập nhật dữ liệu
      stories[index] = {
        ...stories[index],
        title: newTitle,
        description: newDescription,
        category,
        thumbnail: imageUri,
      };

      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(stories));

      const updatedStory = { ...stories[index] };
      Alert.alert('Thành công', 'Cập nhật truyện thành công!');

      // Gọi callback để cập nhật lại màn hình trước đó
      if (route.params?.onUpdateSuccess) {
        route.params.onUpdateSuccess(updatedStory);
      }
      navigation.navigate('StoryDetailScreen', {
        story: updatedStory,
      });
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Alert.alert('Lỗi', 'Có lỗi khi cập nhật truyện.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa Truyện</Text>
      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Mô tả"
        value={newDescription}
        onChangeText={setNewDescription}
        multiline
      />
       <Text style={styles.label}>Chọn thể loại:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}  // Hiển thị thể loại hiện tại
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Hài hước" value="Comedy" />
          <Picker.Item label="Trinh thám" value="Detective" />
          <Picker.Item label="Học đường" value="School Life" />
          <Picker.Item label="Đam mỹ" value="BL" />
          <Picker.Item label="Bách hợp" value="GL" />
          <Picker.Item label="Xuyên không" value="Time Travel" />
          <Picker.Item label="Tiên hiệp" value="Cultivation" />
          <Picker.Item label="Ngôn tình" value="Romantic" />
          <Picker.Item label="Lịch sử" value="Historical" />
          <Picker.Item label="Võ hiệp" value="Martial Arts" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Chọn Ảnh Thumbnail</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>Chưa có ảnh</Text>
      )}

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Hủy" color="#F44336"  onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Cập nhật" color="#4CAF50" onPress={updateStoryInStorage} />
        </View>
        
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc', // hoặc '#2196F3' cho xanh dương
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    height: 60
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  noImage: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    },
    buttonWrapper: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 20,
    },

  picker: {
    height: 70,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,   
  },
});

export default EditStoryScreen;
