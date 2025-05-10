import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';

const StoryDetailScreen = ({ route }) => {
  const [story] = useState(route.params.story);
  const navigation = useNavigation();

  const [updatedStory, setUpdatedStory] = useState(story);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [newTitle, setNewTitle] = useState(story.title);
  const [newDescription, setNewDescription] = useState(story.description);
  const [imageUri, setImageUri] = useState(story.thumbnail || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentStory, setCurrentStory] = useState(story);

  useFocusEffect(
    React.useCallback(() => {
      const loadUpdatedStory = async () => {
        try {
          const username = await AsyncStorage.getItem('username');
          const savedStories = await AsyncStorage.getItem(`stories_${username}`);
          const stories = JSON.parse(savedStories) || [];
          const latestStory = stories.find(item => item.title === story.title);
          if (latestStory) {
            setUpdatedStory(latestStory);
            setImageUri(latestStory.thumbnail || '');
          }
        } catch (error) {
          console.error('Error loading updated story:', error);
        }
      };

      loadUpdatedStory();
    }, [story.title])
  );

  // Update story data in AsyncStorage
  const updateStoryInStorage = async (updatedStory) => {
    try {
      const username = await AsyncStorage.getItem('username');
      const savedStories = await AsyncStorage.getItem(`stories_${username}`);
      const stories = JSON.parse(savedStories) || [];
      const updatedStories = stories.map(item =>
        item.title === updatedStory.title ? updatedStory : item
      );

      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(updatedStories));
      setUpdatedStory(updatedStory);
    } catch (error) {
      console.error('Error updating story in storage:', error);
      Alert.alert('Lỗi', 'Có lỗi khi cập nhật dữ liệu truyện.');
    }
  };

  // Handle add chapter functionality
  const handleAddChapter = async () => {
    if (!chapterTitle || !chapterContent) {
      return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin chương!');
    }

    const newChapter = { title: chapterTitle, content: chapterContent };
    const updatedStoryData = { ...updatedStory, chapters: [...(updatedStory.chapters || []), newChapter] };
    await updateStoryInStorage(updatedStoryData);

    Alert.alert('Thành công', 'Chương mới đã được thêm vào truyện!');
    setChapterTitle('');
    setChapterContent('');
    toggleAddChapterModal();
  };

  // Handle delete chapter functionality
  const handleDeleteChapter = async (indexToDelete) => {
    const newChapters = updatedStory.chapters.filter((_, index) => index !== indexToDelete);
    const updatedStoryData = { ...updatedStory, chapters: newChapters };
    await updateStoryInStorage(updatedStoryData);

    Alert.alert('Thành công', 'Chương đã bị xóa!');
  };

  const handleChapterPress = (chapter, chapters, storyTitle ) => {
    navigation.navigate('ChapterDetailScreen', { chapter,chapters,storyTitle }); 
  };

  useEffect(() => {
    setNewTitle(updatedStory.title);
    setNewDescription(updatedStory.description);
  }, [updatedStory]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editStoryButton}
        onPress={() => navigation.navigate('EditStoryScreen', {
          story: currentStory,
          onUpdateSuccess: (newStory) => {
            setCurrentStory(newStory); // Cập nhật lại currentStory sau khi chỉnh sửa
            setUpdatedStory(newStory);  // Cập nhật lại updatedStory nếu cần
          }
        })}
      >
        <Ionicons name="create" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Image source={{ uri: imageUri || story.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.author}>Tác giả: {story.author}</Text>
      </View>

      <Text style={styles.description}>{story.description}</Text>

      <TouchableOpacity style={styles.addChapterButton} onPress={() => navigation.navigate('AddChapterScreen', { story: updatedStory })}>
        <Text style={styles.addChapterButtonText}>Thêm Chapter Mới</Text>
      </TouchableOpacity>

      {updatedStory.chapters && updatedStory.chapters.length > 0 ? (
        <View style={styles.chapterList}>
          <Text style={styles.chapterListTitle}>Các Chương Đã Được Thêm:</Text>
          {updatedStory.chapters.map((chapter, index) => (
            <View key={index} style={styles.chapterItem}>
              <TouchableOpacity style={styles.chapterTextContainer} onPress={() => handleChapterPress(chapter, updatedStory.chapters, updatedStory.title)}>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa chương này?', [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xóa', onPress: () => handleDeleteChapter(index), style: 'destructive' },
                  ])
                }
              >
                <Text style={styles.deleteButtonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noChapters}>Chưa có chương nào được thêm!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  thumbnail: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: 'gray',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  addChapterButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addChapterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  chapterList: {
    marginTop: 20,
  },
  chapterListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noChapters: {
    fontSize: 16,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectImageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectImageButtonText: {
    color: 'white',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  noImageText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  editStoryButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default StoryDetailScreen;
