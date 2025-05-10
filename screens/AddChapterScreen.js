// AddChapterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AddChapterScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  const handleAddChapter = async () => {
    if (!chapterTitle || !chapterContent) {
      return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin chương!');
    }

    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) return Alert.alert('Lỗi', 'Không tìm thấy username.');

      const savedStories = await AsyncStorage.getItem(`stories_${username}`);
      const stories = savedStories ? JSON.parse(savedStories) : [];

      const index = stories.findIndex(item => item.id === story.id);
      if (index === -1) return Alert.alert('Lỗi', 'Không tìm thấy truyện.');

      const newChapter = { title: chapterTitle, content: chapterContent };
      const updatedChapters = [newChapter, ...(stories[index].chapters || [])];
      stories[index].chapters = updatedChapters;

      await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(stories));

      Alert.alert('Thành công', 'Chương mới đã được thêm vào truyện!');
      setChapterTitle('');
      setChapterContent('');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể thêm chương.');
    }
  };
return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.buttonRow}>
          <Button title="Hủy" onPress={() => navigation.goBack()} color="red" />
          <Button title="Thêm Chương" onPress={handleAddChapter} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Tiêu đề chương"
          value={chapterTitle}
          onChangeText={setChapterTitle}
        />
        <View style={styles.separator} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nội dung chương"
          value={chapterContent}
          onChangeText={setChapterContent}
          multiline
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  separator: {
  height: 1,
  backgroundColor: '#ccc',
  marginVertical: 10,
},
  textArea: {
    height: 7700,
    textAlignVertical: 'top',
  },
});

export default AddChapterScreen;
