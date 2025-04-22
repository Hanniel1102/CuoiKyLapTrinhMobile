import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Đảm bảo AsyncStorage được import

const FollowedAuthors = () => {
  const [followedAuthors, setFollowedAuthors] = useState([]); // Danh sách tác giả theo dõi
  const [username, setUsername] = useState(''); // Tên người dùng

  // Lấy danh sách các tác giả đã theo dõi khi component được tải
  useEffect(() => {
    const getFollowedAuthors = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername); // Lưu tên người dùng vào state

        if (storedUsername) {
          // Lấy danh sách tác giả theo dõi của người dùng từ AsyncStorage
          const followed = await AsyncStorage.getItem(`followedAuthors_${storedUsername}`);
          if (followed) {
            setFollowedAuthors(JSON.parse(followed)); // Cập nhật lại danh sách tác giả đã theo dõi
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tác giả đã theo dõi:', error);
      }
    };

    getFollowedAuthors();
  }, []);

  // Hàm để bỏ theo dõi tác giả
  const handleUnfollow = (author) => {
    Alert.alert(
      'Unfollow Author',
      `Are you sure you want to unfollow ${author}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            // Xóa tác giả khỏi danh sách theo dõi
            const updatedAuthors = followedAuthors.filter(item => item !== author);
            setFollowedAuthors(updatedAuthors);

            // Cập nhật lại danh sách trong AsyncStorage
            try {
              await AsyncStorage.setItem(`followedAuthors_${username}`, JSON.stringify(updatedAuthors));
              Alert.alert('Success', `${author} has been unfollowed.`);
            } catch (error) {
              console.error('Error saving unfollowed author:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Followed Authors</Text>
      {followedAuthors.length === 0 ? (
        <Text style={styles.noAuthors}>You are not following any authors yet.</Text>
      ) : (
        <ScrollView style={styles.list}>
          {followedAuthors.map((author, index) => (
            <View key={index} style={styles.authorItem}>
              <Text style={styles.authorName}>{author}</Text>
              <TouchableOpacity
                style={styles.unfollowButton}
                onPress={() => handleUnfollow(author)}
              >
                <Text style={styles.unfollowButtonText}>Unfollow</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noAuthors: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    marginBottom: 20,
  },
  authorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  unfollowButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unfollowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FollowedAuthors;
