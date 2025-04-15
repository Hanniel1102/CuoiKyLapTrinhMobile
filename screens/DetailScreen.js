import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,  Modal, TextInput, Button, Animated  } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Icon mũi tên quay lại

const DetailScreen = ({ route, navigation }) => {
  const { book } = route.params; // Nhận thông tin sách từ tham số điều hướng

  // State để lưu trữ tab hiện tại
  const [activeTab, setActiveTab] = useState('about'); // Mặc định hiển thị About
  const [modalVisible, setModalVisible] = useState(false); // Điều khiển modal
  const [reviewText, setReviewText] = useState(''); // Lưu trữ nội dung bình luận
  const [modalTranslateY] = useState(new Animated.Value(500)); // Start from below the screen
  
  // Hiệu ứng mở modal
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalTranslateY, {
      toValue: 0, // Điều chỉnh modal lên trên
      duration: 300, // Thời gian mở modal
      useNativeDriver: true,
    }).start();
  };

  // Đóng modal
  const closeModal = () => {
    Animated.timing(modalTranslateY, {
      toValue: 500, // Đưa modal xuống dưới màn hình
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Gửi bình luận (ở đây bạn có thể thêm chức năng gửi bình luận)
  const handleAddReview = () => {
    console.log("New Review: ", reviewText);
    setReviewText(''); // Reset nội dung bình luận
    closeModal(); // Đóng modal sau khi gửi
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <Text style={styles.description}>{book.volumeInfo.description || "No description available."}</Text>;
      case 'chapters':
        return (
          <View style={styles.chapterList}>
            {book.volumeInfo.chapter?.map((chapter, index) => (
              <TouchableOpacity key={index} style={styles.chapterItem}>
                <Text style={styles.chapterText}>{chapter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.reviews}>
            <Text style={styles.reviewText}>Review 1: This book is amazing!</Text>
            <TouchableOpacity style={styles.addReviewButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addReviewButtonText}>+ Add Review</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return <Text style={styles.description}>{book.volumeInfo.description || "No description available."}</Text>;
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrowleft" size={30} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        {/* Ảnh bìa sách */}
        <Image
          source={{ uri: book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100x150.png' }}
          style={styles.bookImage}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.volumeInfo.title}</Text>
          <Text style={styles.bookAuthor}>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</Text>
          <Text style={styles.bookCategory}>{book.volumeInfo.categories?.join(', ') || 'No Category'}</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'about' && styles.activeTab]} onPress={() => setActiveTab('about')}>
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'chapters' && styles.activeTab]} onPress={() => setActiveTab('chapters')}>
          <Text style={[styles.tabText, activeTab === 'chapters' && styles.activeTabText]}>Chapters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'reviews' && styles.activeTab]} onPress={() => setActiveTab('reviews')}>
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
      {/* Modal để thêm bình luận */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Review</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your review here"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Button title="Submit" onPress={handleAddReview} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
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
  backButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 75,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookInfo: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#888',
  },
  bookCategory: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5,
  },
  bookRating: {
    fontSize: 16,
    color: '#FFD700', // Màu vàng cho đánh giá
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6347', // Màu đỏ cho tab đang hoạt động
  },
  activeTabText: {
    color: '#FF6347', // Màu chữ cho tab đang hoạt động
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  chapterList: {
    marginBottom: 15,
  },
  chapterItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  chapterText: {
    fontSize: 16,
    color: '#333',
  },
  reviews: {
    marginBottom: 20,
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  addReviewButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: '30%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default DetailScreen;
