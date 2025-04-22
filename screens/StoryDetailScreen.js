import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const StoryDetailScreen = ({ route }) => {
  const { story } = route.params; // Lấy truyện được truyền từ màn hình trước
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedStory, setUpdatedStory] = useState(story); // Lưu bản sao truyện đã cập nhật
  const navigation = useNavigation();

  // Hàm mở modal để thêm chapter mới
  const openAddChapterModal = () => {
    setModalVisible(true);
  };

  // Hàm đóng modal
  const closeAddChapterModal = () => {
    setModalVisible(false);
  };

  // Hàm thêm chapter mới vào truyện
  const handleAddChapter = async () => {
    if (chapterTitle === '' || chapterContent === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin chương!');
      return;
    }

    try {
      // Kiểm tra xem các chương đã có chưa, nếu chưa thì khởi tạo mảng chapters
      if (!updatedStory.chapters) {
        updatedStory.chapters = [];
      }

      // Thêm chương mới vào mảng chapters
      const newChapter = { title: chapterTitle, content: chapterContent };
      updatedStory.chapters.push(newChapter);

      // Cập nhật lại danh sách truyện trong AsyncStorage
      const username = await AsyncStorage.getItem('username');
      const savedStories = await AsyncStorage.getItem(`stories_${username}`);
      const stories = JSON.parse(savedStories);
      const updatedStories = stories.map(item =>
        item.title === updatedStory.title ? updatedStory : item
      );

      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(updatedStories));

      // Thông báo thêm chương thành công
      Alert.alert('Thành công', 'Chương mới đã được thêm vào truyện.');

      // Đóng modal và reset input
      closeAddChapterModal();
      setChapterTitle('');
      setChapterContent('');
      setUpdatedStory(updatedStory); // Cập nhật lại truyện hiển thị
    } catch (error) {
      console.error('Lỗi khi thêm chương:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thêm chương mới.');
    }
  };

  const handleDeleteChapter = async (indexToDelete) => {
    try {
      const newChapters = [...updatedStory.chapters];
      newChapters.splice(indexToDelete, 1); // Xóa chương tại vị trí index
  
      const newStory = { ...updatedStory, chapters: newChapters };
  
      // Lưu lại vào AsyncStorage
      const username = await AsyncStorage.getItem('username');
      const savedStories = await AsyncStorage.getItem(`stories_${username}`);
      const stories = JSON.parse(savedStories);
      const updatedStories = stories.map(item =>
        item.title === newStory.title ? newStory : item
      );
  
      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(updatedStories));
  
      setUpdatedStory(newStory);
      Alert.alert('Thành công', 'Đã xóa chương!');
    } catch (error) {
      console.error('Lỗi khi xóa chương:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xóa chương.');
    }
  };
  
  // Hàm để hiển thị chi tiết chương khi người dùng nhấn vào một chương
  const handleChapterPress = (chapter) => {
    navigation.navigate('ChapterDetailScreen', { chapter }); // Chuyển sang màn hình ChapterDetailScreen và truyền dữ liệu chapter
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: story.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.author}>Tác giả: {story.author}</Text>
      </View>

      <Text style={styles.description}>{story.description}</Text>
      <TouchableOpacity style={styles.addChapterButton} onPress={openAddChapterModal}>
        <Text style={styles.addChapterButtonText}>Thêm Chapter Mới</Text>
      </TouchableOpacity>

      {/* Hiển thị danh sách các chương đã có */}
      {updatedStory.chapters && updatedStory.chapters.length > 0 ? (
        <View style={styles.chapterList}>
          <Text style={styles.chapterListTitle}>Các Chương Đã Được Thêm:</Text>
          {updatedStory.chapters.map((chapter, index) => (
            <View key={index} style={styles.chapterItem}>
            <TouchableOpacity
              style={styles.chapterTextContainer}
              onPress={() => handleChapterPress(chapter)}
            >
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa chương này?', [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Xóa', onPress: () => handleDeleteChapter(index), style: 'destructive' }
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

      {/* Modal để thêm chương mới */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeAddChapterModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Chương Mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Tiêu đề chương"
              value={chapterTitle}
              onChangeText={setChapterTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nội dung chương"
              value={chapterContent}
              onChangeText={setChapterContent}
              multiline
            />
            <Button title="Thêm Chương" onPress={handleAddChapter} />
            <Button title="Hủy" onPress={closeAddChapterModal} color="red" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnail: {
    width: 300,
    height: 500,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  author: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  addChapterButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addChapterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedChapterContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedChapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedChapterContent: {
    fontSize: 16,
    marginTop: 10,
  },
  noChapters: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    minHeight: '30%',
    marginHorizontal: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  chapterTextContainer: {
    flex: 1,
  },
  
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  
  deleteButton: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },  
});

export default StoryDetailScreen;
