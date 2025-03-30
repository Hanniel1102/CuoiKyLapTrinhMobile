import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image, ImageBackground} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Login({ navigation }) {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
    {/* <ImageBackground source={require('../assets/Image/bgr.jpg')} style={styles.container}> */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/Image/arrow-left.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Sign In</Text>
      </View>

      <View style={styles.layout}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to JELLYCO</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your Phone number or Email address for sign in. Enjoy reading.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={24} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Username" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.rememberMeContainer}>
            <Switch
              value={rememberMe}
              onValueChange={(value) => setRememberMe(value)}
              thumbColor={rememberMe ? "#008080" : "#ccc"}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forget Password!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
            Signup
          </Text>
        </Text>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Image source={require("../assets/Image/fb.png")} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Connect With Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <Image source={require("../assets/Image/google.png")} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Connect With Google</Text>
        </TouchableOpacity>
      </View>      
    {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(217, 191, 241, 0.69)', 
    marginTop: 0,
    paddingTop: 0,
    resizeMode: 'cover',
  },
  headerContainer: {
    width: '100%',
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 120,
    marginTop:50,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    alignItems: 'center',
    marginLeft: '30%',
    color: '#fff',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  layout: {
    paddingHorizontal: 25,
  },
  welcomeContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(208, 162, 235, 0.9)',
    height: 50,
  },
  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#008080",
    fontWeight: "bold",
  },
  signInButton: {
    backgroundColor: 'rgba(26, 155, 241, 0.9)',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  signupLink: {
    color: "#008080",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
    marginTop: 10,
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  googleButton: {
    backgroundColor: "#db4a39",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

