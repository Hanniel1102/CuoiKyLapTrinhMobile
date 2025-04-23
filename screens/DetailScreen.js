import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Modal, TextInput, Button, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // Icon mũi tên quay lại
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ route, navigation }) => {
  const { book } = route.params; // Nhận thông tin sách từ tham số điều hướng

  const [activeTab, setActiveTab] = useState('about'); // Mặc định hiển thị About
  const [modalVisible, setModalVisible] = useState(false); // Điều khiển modal
  const [reviewText, setReviewText] = useState(''); // Lưu trữ nội dung bình luận
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái để kiểm tra xem sách đã được yêu thích chưa
  const [modalTranslateY] = useState(new Animated.Value(500)); // Start from below the screen
  const [username, setUsername] = useState(''); // Lưu tên người dùng
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    // Lấy thông tin username từ AsyncStorage
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername); // Lưu username vào state
  
      if (storedUsername) {
        const storedFavorites = await AsyncStorage.getItem(`favoriteBooks_${storedUsername}`);
        const favoriteBooks = storedFavorites ? JSON.parse(storedFavorites) : [];
        const isBookFavorite = favoriteBooks.some(item => item.id === book.id); // Kiểm tra xem sách đã có trong yêu thích chưa
        setIsFavorite(isBookFavorite); // Cập nhật trạng thái yêu thích
      }
    };
  
    const loadReviews = async () => {
      try {
        const stored = await AsyncStorage.getItem(`reviews_${book.title}`); // Lấy reviews của sách theo book.id
        if (stored) {
          setReviews(JSON.parse(stored)); // Cập nhật lại danh sách reviews cho sách hiện tại
        }
      } catch (error) {
        console.error('Lỗi khi lấy review:', error);
      }
    };
  
    getUsername();
    loadReviews();
  }, [book.title]);; // Kiểm tra lại khi ID sách thay đổi

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
  const handleAddReview = async () => {
    if (reviewText.trim() === '') {
      Alert.alert('Thông báo', 'Bạn chưa nhập nội dung đánh giá.');
      return;
    }
  
    const newReview = {
      id: Date.now(),
      bookTitle: book.title, // Lưu tên sách
      user: username || 'Ẩn danh',
      text: reviewText.trim(),
    };
  
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    setReviewText(''); // Xóa nội dung sau khi thêm bình luận
    closeModal();
  
    try {
      // Lưu đánh giá cho sách với book.id duy nhất
      await AsyncStorage.setItem(`reviews_${book.title}`, JSON.stringify(updatedReviews));
    } catch (error) {
      console.error('Lỗi khi lưu review:', error);
    }
  };

  // Thêm vào yêu thích hoặc xóa khỏi yêu thích
  const handleAddToFavorites = async () => {
    try {
      if (!username) {
        Alert.alert('Thông báo', 'Bạn cần đăng nhập để thêm sách vào yêu thích.');
        return;
      }

      // Lấy danh sách yêu thích từ AsyncStorage theo username
      const storedFavorites = await AsyncStorage.getItem(`favoriteBooks_${username}`);
      const favoriteBooks = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // Nếu sách đã yêu thích, xóa nó khỏi danh sách yêu thích
        const updatedFavorites = favoriteBooks.filter(item => item.id !== book.id);
        await AsyncStorage.setItem(`favoriteBooks_${username}`, JSON.stringify(updatedFavorites));
        setIsFavorite(false); // Đánh dấu sách đã bị bỏ khỏi danh sách yêu thích
        Alert.alert('Thành công', 'Sách đã được bỏ khỏi danh sách yêu thích.');
      } else {
        // Nếu sách chưa yêu thích, thêm vào danh sách yêu thích
        favoriteBooks.push(book);
        await AsyncStorage.setItem(`favoriteBooks_${username}`, JSON.stringify(favoriteBooks));
        setIsFavorite(true); // Đánh dấu sách đã được thêm vào danh sách yêu thích
        Alert.alert('Thành công', 'Sách đã được thêm vào danh sách yêu thích.');
      }
    } catch (error) {
      console.error('Lỗi khi thao tác với yêu thích:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thao tác với yêu thích.');
    }
  };

  // Khi render bình luận, chỉ hiển thị các bình luận của sách hiện tại
  const renderReviews = () => {
    if (reviews.length === 0) {
      return <Text style={styles.reviewText}>Chưa có đánh giá nào.</Text>;
    }
  
    return (
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewText}><Text style={{ fontWeight: 'bold' }}>{item.user}: </Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // Dùng ID của review làm key
      />
    );
  };
  

   // Hàm để hiển thị chi tiết chương khi người dùng nhấn vào một chương
   const handleChapterPress = (chapter) => {
    navigation.navigate('ChapterDetailScreen', { chapter }); // Chuyển sang màn hình ChapterDetailScreen và truyền dữ liệu chapter
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <Text style={styles.description}>{book.description || "No description available."}</Text>;
      case 'chapters':
        return (
          <View style={styles.chapterList}>
            {book.chapters?.map((chapter, index) => (
              <TouchableOpacity key={index} style={styles.chapterItem} onPress={() => handleChapterPress(chapter)}>
                <Text style={styles.chapterText}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.reviews}>
            {renderReviews()}
            <TouchableOpacity style={styles.addReviewButton} onPress={openModal}>
              <Text style={styles.addReviewButtonText}>+ Add Review</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return <Text style={styles.description}>{book.description || "No description available."}</Text>;
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
          source={{ uri: book.link_thumbnail || 'https://via.placeholder.com/100x150.png' }}
          style={styles.bookImage}
        />
        <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>
            {book.authors?.map(author => author.name).join(', ') || 'Unknown Author'}
          </Text>
          <Text style={styles.bookCategory}>{book.categories?.join(', ') || 'No Category'}</Text>
          <Text style={styles.bookCategory}>{book.view_count || 'No View'}</Text>
        </View>
      </View>

      {/* Button thêm vào danh sách yêu thích */}
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={handleAddToFavorites}
      >
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Bỏ khỏi Yêu Thích' : 'Thêm vào Yêu Thích'}
        </Text>
      </TouchableOpacity>

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
  favoriteButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF6347', // Màu đỏ khi đã thêm vào yêu thích
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
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
  chapterItem: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  addReviewButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50', // Màu nền cho nút
    borderRadius: 8, // Bo góc cho nút
    alignItems: 'center', // Canh giữa nội dung
    justifyContent: 'center', // Canh giữa nội dung
    width: '50%', // Chiều rộng của nút
    alignSelf: 'center', // Canh giữa nút theo chiều ngang
  },
  
  addReviewButtonText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 16, // Kích thước chữ
    fontWeight: 'bold', // Đậm chữ
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
