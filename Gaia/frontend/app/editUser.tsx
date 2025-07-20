import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const EditUser = () => {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const [name, setName] = useState(user?.unsafeMetadata?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("🧾 Current Clerk Info:");
      console.log("🧑 Name:", user.unsafeMetadata?.name || "(not set)");
      console.log(
        "📧 Email:",
        user.primaryEmailAddress?.emailAddress || "No email",
      );
      console.log("🔒 Password: (not accessible)");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "No user is currently signed in.");
      return;
    }

    try {
      if (name && name !== user.unsafeMetadata?.name) {
        await user.update({
          unsafeMetadata: {
            name,
          },
        });
        console.log("✅ Name updated:", name);
      }

      if (newPassword) {
        if (!currentPassword) {
          Alert.alert("Current password is required");
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert("Passwords do not match");
          return;
        }

        await user.updatePassword({
          currentPassword,
          newPassword,
        });

        console.log("✅ Password updated");
      }

      Alert.alert("Success", "Your profile has been updated.");
      router.back();
    } catch (error: any) {
      console.error("❌ Failed to update user:", error);
      Alert.alert("Update failed", error.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTintColor: "black",
          headerBackTitle: "back",
        }}
      />
      <View style={styles.headerContainer}>
        <Feather name="user" size={30} color="#13875B" style={{ marginRight: 10 }} />
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            placeholder="Current password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Feather
              name={showCurrentPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            placeholder="New password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Feather
              name={showNewPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithIcon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Feather
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 2,
    color: "#13875B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafbfc",
    fontSize: 15,
    color: "#222",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    backgroundColor: "#fafbfc",
    fontSize: 15,
    color: "#222",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    padding: 4,
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
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default EditUser;
