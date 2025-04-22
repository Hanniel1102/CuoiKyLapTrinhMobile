import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostStoryScreen = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const savedStories = await AsyncStorage.getItem(`stories_${username}`);
        if (savedStories) {
          setStories(JSON.parse(savedStories));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryPress = (story) => {
    navigation.navigate('StoryDetailScreen', { story });
  };

  const handleAddStory = () => {
    navigation.navigate('AddStoryScreen');
  };
  // Hàm xóa truyện khỏi danh sách
  const handleDeleteStory = async (story) => {
    Alert.alert(
      'Xóa Truyện',
      `Bạn có chắc chắn muốn xóa truyện "${story.title}" khỏi danh sách?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const username = await AsyncStorage.getItem('username');
              const updatedStories = stories.filter((item) => item.title !== story.title);

              // Cập nhật lại danh sách truyện trong AsyncStorage
              await AsyncStorage.setItem(`stories_${username}`, JSON.stringify(updatedStories));

              // Cập nhật lại state để loại bỏ truyện vừa xóa
              setStories(updatedStories);
              Alert.alert('Thành công', `Truyện "${story.title}" đã bị xóa.`);
            } catch (error) {
              console.error('Lỗi khi xóa truyện:', error);
              Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi xóa truyện.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản Lý Truyện</Text>

      <TouchableOpacity style={styles.button} onPress={handleAddStory}>
        <Text style={styles.buttonText}>Thêm Truyện Mới</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Danh sách truyện đã đăng</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.listContainer}>
          {stories.length > 0 ? (
            stories.map((story, index) => (
              <View key={index} style={styles.storyItem}>
                <TouchableOpacity style={styles.display} onPress={() => handleStoryPress(story)}>
                  {story.thumbnail ? (
                    <Image source={{ uri: story.thumbnail }} style={styles.thumbnailImage} />
                  ) : null}
                  <Text style={styles.storyTitle}>{story.title}</Text>
                </TouchableOpacity>
                {/* Nút xóa truyện */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteStory(story)}
                >
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noStories}>Chưa có truyện nào được đăng!</Text>
          )}
        </ScrollView>
      )}
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
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
  },
  storyItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9', // Tạo màu nền sáng hơn cho các item
    padding: 15,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginBottom: 15, // Tăng khoảng cách giữa các item
    shadowColor: '#000', // Thêm bóng đổ cho các item
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Đảm bảo trên Android
  },
  display : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noStories: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default PostStoryScreen;