import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState('');

  // Lấy tên người dùng từ AsyncStorage khi component được tải
  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };

    getUsername(); // Kiểm tra khi component được render
  }, []);

  // Lấy lịch sử từ AsyncStorage riêng của người dùng
  useEffect(() => {
    if (username) {
      const loadHistory = async () => {
        try {
          const historyData = await AsyncStorage.getItem(`history_${username}`);
          if (historyData) {
            setHistory(JSON.parse(historyData));
          }
        } catch (error) {
          console.error('Error loading history:', error);
        }
      };
      loadHistory(); // Kiểm tra khi username thay đổi
    }
  }, [username]);

  // Handle removing a book from history
  const handleRemoveFromHistory = async (book) => {
    try {
      const updatedHistory = history.filter((item) => item.id !== book.id);
      setHistory(updatedHistory);
      await AsyncStorage.setItem(`history_${username}`, JSON.stringify(updatedHistory));
      Alert.alert('Removed', `${book.volumeInfo.title} has been removed from history.`);
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Đọc Sách</Text>
      {history.length === 0 ? (
        <Text style={styles.noHistory}>Bạn chưa đọc sách nào.</Text>
      ) : (
        <ScrollView style={styles.list}>
          {history.map((book, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyBookTitle}>{book.volumeInfo.title}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromHistory(book)}
              >
                <Text style={styles.removeButtonText}>Xóa</Text>
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
  noHistory: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    marginBottom: 20,
  },
  historyItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyBookTitle: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
