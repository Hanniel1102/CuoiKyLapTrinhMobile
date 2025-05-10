import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import BooksByCategory from './screens/BooksByCategory';
import Authors from './screens/AuthorsScreen';
import DetailScreen from './screens/DetailScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthorList from './screens/AuthorList';
import FavoriteList from './screens/FavoriteList';  
import FollowedAuthors from './screens/FollowedAuthors';
import HistoryScreen from './screens/HistoryScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import PostStory from './screens/PostStory';
import AddStoryScreen from './screens/AddStoryScreen';
import StoryDetailScreen from './screens/StoryDetailScreen';
import ChapterDetailScreen from './screens/ChapterDetailScreen';
import AddChapterScreen from './screens/AddChapterScreen';
import EditStoryScreen from './screens/EditStoryScreen';
import EditChapterScreen from './screens/EditChapterScreen';

const Stack = createStackNavigator();

// Component để bao bọc các màn hình có bottom menu
const ScreenWithBottomMenu = ({ navigation, children }) => {
  const [activeMenu, setActiveMenu] = useState('Home'); // Theo dõi menu đang được chọn
  const [scale] = useState(new Animated.Value(1)); // Khởi tạo Animated.Value cho hiệu ứng phóng to

  // Cập nhật activeMenu khi chuyển sang màn hình khác
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentRoute = navigation.getState().routes[navigation.getState().index].name;
      setActiveMenu(currentRoute); // Cập nhật activeMenu theo màn hình hiện tại
    });

    return unsubscribe;
  }, [navigation]);

  const handlePress = (menu) => {
    setActiveMenu(menu); // Cập nhật menu đang chọn
    navigation.navigate(menu); // Điều hướng đến màn hình tương ứng
  };

  const handlePressIn = () => {
    // Phóng to mục menu khi nhấn
    Animated.spring(scale, {
      toValue: 1.1, // Tăng kích thước
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Thu nhỏ mục menu khi thả
    Animated.spring(scale, {
      toValue: 1, // Quay lại kích thước ban đầu
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        {['Home', 'Category', 'Search', 'PostStory', 'Profile'].map((menu, index) => (
          <Animated.View
            key={menu}
            style={[ 
              styles.menuItem,
              activeMenu === menu && styles.activeMenuItem,
              { transform: [{ scale }] }, // Áp dụng hiệu ứng phóng to
            ]}>
            <TouchableOpacity
              style={styles.menuButton}
              onPressIn={handlePressIn} // Khi nhấn vào, phóng to
              onPressOut={handlePressOut} // Khi thả, thu nhỏ
              onPress={() => handlePress(menu)} // Điều hướng tới màn hình
            >
              <Ionicons
                name={
                  menu === 'Home' ? 'home' :
                  menu === 'Category' ? 'list' :
                  menu === 'Search' ? 'search' :
                  menu === 'PostStory' ? 'pencil-outline' : 
                  'person'
                }
                size={24}
                color={activeMenu === menu ? '#007bff' : '#333'}
              />
              <Text style={[styles.menuText, activeMenu === menu && styles.activeMenuText]}>
                {menu}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false, // Tắt hiệu ứng chuyển trang
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        
        {/* Bọc HomeScreen và CategoryScreen với ScreenWithBottomMenu */}
        <Stack.Screen 
          name="Home" 
          component={(props) => (
            <ScreenWithBottomMenu {...props}>
              <HomeScreen />
            </ScreenWithBottomMenu>
          )}
        />

        <Stack.Screen 
          name="Category" 
          component={(props) => (
            <ScreenWithBottomMenu {...props}>
              <CategoryScreen />
            </ScreenWithBottomMenu>
          )}
        />
        <Stack.Screen 
          name="Search" 
          component={(props) => (
            <ScreenWithBottomMenu {...props}>
              <SearchScreen />
            </ScreenWithBottomMenu>
          )}
        />
        <Stack.Screen 
          name='PostStory' 
          component={(props) => (
            <ScreenWithBottomMenu {...props}>
              <PostStory/>
            </ScreenWithBottomMenu>
          )} 
        />
          
        <Stack.Screen 
          name="Profile" 
          component={(props) => (
            <ScreenWithBottomMenu {...props}>
              <ProfileScreen />
            </ScreenWithBottomMenu>
          )}
        />
        <Stack.Screen name="BooksByCategory" component={BooksByCategory} />
        <Stack.Screen name="BooksByAuthors" component={Authors} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name='AuthorList' component={AuthorList} />
        <Stack.Screen name='FavoriteList' component={FavoriteList} />
        <Stack.Screen name='FollowedAuthors' component={FollowedAuthors}/>
        <Stack.Screen name='HistoryScreen' component={HistoryScreen}/>
        <Stack.Screen name='UserProfileScreen' component={UserProfileScreen}/>
        <Stack.Screen name='AddStoryScreen' component={AddStoryScreen} />
        <Stack.Screen name='StoryDetailScreen' component={StoryDetailScreen} />
        <Stack.Screen name='ChapterDetailScreen' component={ChapterDetailScreen} />
        <Stack.Screen name='AddChapterScreen' component={AddChapterScreen} />
        <Stack.Screen name='EditStoryScreen' component={EditStoryScreen} />
        <Stack.Screen name='EditChapterScreen' component={EditChapterScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: 'row', // Dọc theo chiều ngang
    justifyContent: 'space-around', // Chia đều không gian giữa các item
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,  // Đảm bảo các mục chiếm đều không gian
  },
  menuButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  activeMenuItem: {
    backgroundColor: '#e0e0e0',  // Màu nền khi menu được chọn
    borderRadius: 5,
    elevation: 5,  // Thêm bóng cho hiệu ứng nổi
  },
  activeMenuText: {
    color: '#007bff',  // Màu chữ khi menu được chọn
    fontWeight: 'bold',
  },
});
