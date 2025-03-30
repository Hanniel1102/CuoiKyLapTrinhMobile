import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SignUp({ navigation }) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError(""); // Xóa lỗi nếu nhập đúng
    // Xử lý đăng ký (Gửi dữ liệu lên server, lưu vào database...)
    console.log("User signed up:", { password });
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/Image/arrow-left.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.header}>Sign Up</Text>
      </View>

      <View style={styles.layout}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Create Your Account</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your details below to sign up and start using JELLYCO.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={24} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Username" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#666" style={styles.inputIcon} />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput 
            placeholder="Confirm Password" 
            style={styles.input} 
            secureTextEntry 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.optionsContainer}>
          <View style={styles.rememberMeContainer}>
            <Switch
              value={acceptTerms}
              onValueChange={(value) => setAcceptTerms(value)}
              thumbColor={acceptTerms ? "#008080" : "#ccc"}
            />
            <Text style={styles.rememberMeText}>I accept the terms and conditions</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Already have an account?{" "}
          <Text style={styles.signupLink} onPress={() => navigation.navigate("Login")}>
            Sign In
          </Text>
        </Text>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <Image source={require("../assets/Image/fb.png")} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Sign Up With Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <Image source={require("../assets/Image/google.png")} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Sign Up With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(217, 191, 241, 0.69)",
  },
  headerContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 80,
    marginTop: 50,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    alignItems: "center",
    marginLeft: "30%",
    color: "#fff",
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
    backgroundColor: "rgba(208, 162, 235, 0.9)",
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
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
  signUpButton: {
    backgroundColor: "rgba(26, 155, 241, 0.9)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  signUpButtonText: {
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
