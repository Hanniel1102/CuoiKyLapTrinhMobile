// AddChapterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddChapterScreen = ({ route, navigation }) => {
  const { story, updateStoryInStorage } = route.params;
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  const handleAddChapter = async () => {
    if (!chapterTitle || !chapterContent) {
      return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin chương!');
    }

    const newChapter = { title: chapterTitle, content: chapterContent };
    const updatedStoryData = { ...story, chapters: [...(story.chapters || []), newChapter] };

    await updateStoryInStorage(updatedStoryData);

    Alert.alert('Thành công', 'Chương mới đã được thêm vào truyện!');
    setChapterTitle('');
    setChapterContent('');
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
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
      <Button title="Hủy" onPress={() => navigation.goBack()} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
});

export default AddChapterScreen;
