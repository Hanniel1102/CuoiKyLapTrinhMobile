import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Icon mũi tên quay lại

const ChapterDetailScreen = ({ route, navigation }) => {
  const { chapter, chapters, storyTitle } = route.params;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(chapters.indexOf(chapter)); // Đánh dấu chương hiện tại

  if (!Array.isArray(chapters)) {
    Alert.alert('Lỗi', 'Không tìm thấy danh sách chương');
    return null;
  }
  const goToNextChapter = () => {
    const nextChapterIndex = selectedChapterIndex + 1;
    if (nextChapterIndex < chapters.length) {
      setSelectedChapterIndex(nextChapterIndex); // Cập nhật chỉ số chương
      navigation.replace('ChapterDetailScreen', {
        chapter: chapters[nextChapterIndex],
        chapters: chapters,
        storyTitle: storyTitle,
      });
    } else {
      alert('Đây là chương cuối cùng');
    }
  };

  // Hàm chuyển sang chương trước
  const goToPreviousChapter = () => {
    const prevChapterIndex = selectedChapterIndex - 1;
    if (prevChapterIndex >= 0) {
      setSelectedChapterIndex(prevChapterIndex); // Cập nhật chỉ số chương
      navigation.replace('ChapterDetailScreen', {
        chapter: chapters[prevChapterIndex],
        chapters: chapters,
        storyTitle: storyTitle,
      });
    } else {
      alert('Đây là chương đầu tiên');
    }
  };
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

      {/* Modal hiển thị menu trượt từ phải */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, isMenuVisible && styles.modalVisible]}>
              <ScrollView style={styles.modalContent}>
                {chapters.map((ch, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.modalItem, selectedChapterIndex === index && styles.selectedItem]} // Đánh dấu chương hiện tại
                    onPress={() => {
                      setSelectedChapterIndex(index); // Cập nhật chỉ số khi chọn chương
                      setIsMenuVisible(false);
                      navigation.replace('ChapterDetailScreen', {
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

      <ScrollView style={styles.chapterContentContainer}>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={styles.chapterContent}>
          {typeof chapter.content === 'string' ? chapter.content : JSON.stringify(chapter.content)}
        </Text>
      </ScrollView>
       <View style={styles.navigationButtons}>
        {selectedChapterIndex > 0 && (
          <TouchableOpacity onPress={goToPreviousChapter} style={styles.arrowButton}>
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
        )}
        {selectedChapterIndex < chapters.length - 1 && (
          <TouchableOpacity onPress={goToNextChapter} style={styles.arrowButton}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:20,
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
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    right: -300,
    transition: 'transform 0.3s ease-out',
  },
  modalVisible: {
    right: 0, 
  },
  modalContent: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
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
});

export default ChapterDetailScreen;
