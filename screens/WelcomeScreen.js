import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground , Switch} from "react-native";


const Stack = createStackNavigator();

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/Image/bgr.jpg')} style={styles.background}>
      <View style={styles.overlay}></View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>WELCOME TO</Text>
          <Text style={styles.Name}>JELLYCO</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInButtonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUnButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    overlay:{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Màu đen 50% */
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection:'column',
        backgroundColor: "rgba(255, 255, 255, 0)",
        paddingHorizontal: 40,
        justifyContent: "center",
      },
      headerContainer: {
        flex: 3,
        flexDirection: "column",
        justifyContent: 'flex-start', // Căn về bên trái
        marginBottom: 10, // Giảm khoảng cách xuống dưới
        marginTop: 150,
      },
      header: {
        color:'#fff',
        fontSize: 24,
        fontWeight: "bold",
      },
      Name: {
        color:'#fff',
        fontFamily: '',
        fontSize: 70,
        fontWeight: "bold",
      },
      buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      signInButton: {
        width: '45%',
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center', // Đảm bảo chữ luôn ở giữa
      },
      signUpButton: {
        width: '45%',
        height: 50,
        backgroundColor: '#A0D4D4',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center', // Đảm bảo chữ luôn ở giữa
      },
      signInButtonText: {
        color: '#006666',
        fontSize: 16,
        fontWeight: 'bold',
      },
      signUnButtonText: {
        color: '#006666',
        fontSize: 16,
        fontWeight: 'bold',
      },
});


export default WelcomeScreen;