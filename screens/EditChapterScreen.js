import React, { useState } from 'react';
import {  KeyboardAvoidingView,  Platform,
 View, Text, StyleSheet, TextInput,Button, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const EditChapterScreen = ({ route, navigation }) => {
  const { chapter, chapters, storyTitle, onUpdateChapter } = route.params;

  // Kiểm tra nếu chapters không phải là mảng và chapter có giá trị hợp lệ
  if (!Array.isArray(chapters) || !chapter) {
    Alert.alert('Lỗi', 'Không tìm thấy danh sách chương hoặc chương hiện tại không hợp lệ');
    return null;
  }
    const [editedChapter, setEditedChapter] = useState(chapter);

    // Hàm lưu lại chương đã chỉnh sửa
    const handleSave = () => {
        if (!editedChapter.title || !editedChapter.content) {
        return Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin chương!');
        }
        onUpdateChapter(editedChapter);  // Gọi hàm cập nhật chương
    };
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(chapters.indexOf(chapter));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrowleft" size={30} color="#333" />
        </TouchableOpacity>

        <Text style={styles.storyTitle}>{storyTitle}</Text>

        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
          <Icon name="bars" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                {chapters.map((ch, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.modalItem, selectedChapterIndex === index && styles.selectedItem]}
                    onPress={() => {
                      setSelectedChapterIndex(index);
                      setIsMenuVisible(false);
                      navigation.replace('EditChapterScreen', {
                        chapter: ch,
                        chapters: chapters,
                        storyTitle: storyTitle,
                      });
                    }}
                  >
                    <Text style={styles.modalItemText}>{ch.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // tùy chỉnh nếu có header
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          value={editedChapter.title}
          onChangeText={(text) => setEditedChapter({ ...editedChapter, title: text })}
          placeholder="Tiêu đề chương"
        />

        <View style={styles.divider} />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={editedChapter.content}
          onChangeText={(text) => setEditedChapter({ ...editedChapter, content: text })}
          placeholder="Nội dung chương"
          multiline
          numberOfLines={200}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu chương</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
  },
  menuButton: {
    padding: 10,
    borderRadius: 5,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chapterContentContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chapterContent: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '60%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    right: 0,
  },

  modalContent: {
    flex: 1,
    padding: 20,
  },
  divider: {
  height: 1,
  backgroundColor: '#ccc',
  marginVertical: 10,
},

  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditChapterScreen;
