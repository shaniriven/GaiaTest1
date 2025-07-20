import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const ContactUs = () => {
  const [subject, setsubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    Alert.alert(
      "Message Sent",
      "Thanks for reaching out. We’ll get back to you soon.",
    );
    setsubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <MaterialIcons name="contact-support" size={30} color="#13875B" style={{ marginRight: 10 }} />
          <Text style={styles.title}>Contact Us</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Feather name="tag" size={18} color="#13875B" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              placeholderTextColor="#888"
              value={subject}
              onChangeText={setsubject}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Feather name="message-square" size={18} color="#13875B" style={styles.icon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your Message"
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8fa",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 16,
    marginTop: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fafbfc",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#13875B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#13875B",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ContactUs;
