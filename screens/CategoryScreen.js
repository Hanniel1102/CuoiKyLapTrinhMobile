import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories, fetchBooksByCategory } from '../API/api'; // Import các hàm API từ file api.js

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]); // Danh sách thể loại lấy từ API
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Sử dụng useNavigation để điều hướng

  // Lấy danh sách thể loại từ API
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true); // Hiển thị indicator khi đang lấy dữ liệu

      try {
        const categoriesList = await fetchCategories(); // Gọi hàm fetchCategories từ api.js
        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thể loại:', error);
        setLoading(false);
      }
    };

    fetchCategoryData(); // Lấy danh sách thể loại khi màn hình được hiển thị
  }, []);

  // Fetch sách theo thể loại khi thể loại được chọn
  const handleCategoryPress = async (category) => {
    setLoading(true); // Hiển thị indicator khi đang lấy dữ liệu
    try {
      const books = await fetchBooksByCategory(category); // Gọi hàm fetchBooksByCategory từ api.js
      setLoading(false);

      // Điều hướng đến màn hình BooksByCategory sau khi lấy sách
      navigation.navigate('BooksByCategory', { category, books });
    } catch (error) {
      console.error('Lỗi khi lấy sách:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tag - Thể Loại</Text>
      <ScrollView style={styles.categoryList} contentContainerStyle={styles.categoryContainer}>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category)} // Khi nhấn vào thể loại, gọi hàm fetch và điều hướng
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noCategories}>No categories available.</Text> // Hiển thị nếu không có thể loại
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  noCategories: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;
