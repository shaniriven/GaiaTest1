import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const EditUser = () => {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const [name, setName] = useState(user?.unsafeMetadata?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("🧾 Current Clerk Info:");
      console.log("🧑 Name:", user.unsafeMetadata?.name || "(not set)");
      console.log("📧 Email:", user.primaryEmailAddress?.emailAddress || "No email");
      console.log("🔒 Password: (not accessible)");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "No user is currently signed in.");
      return;
    }

    try {
      // ✅ Update name in unsafeMetadata
      if (name && name !== user.unsafeMetadata?.name) {
        await user.update({
          unsafeMetadata: {
            name,
          },
        });
        console.log("✅ Name updated:", name);
      }

      // ✅ Update password if requested
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
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
     

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your full name"
      />

      <Text style={styles.label}>Current Password:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputWithIcon}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
          placeholder="Current password"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <Text style={styles.eyeIcon}>{showCurrentPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>New Password:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputWithIcon}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          placeholder="New password"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputWithIcon}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          placeholder="Confirm password"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#13875B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditUser;
