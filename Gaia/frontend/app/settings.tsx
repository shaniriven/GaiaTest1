import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';

const Settings = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const [darkMode, setDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [aboutVisible, setAboutVisible] = React.useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This is permanent.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await user.delete();
              Alert.alert("Account deleted");
            } catch (err) {
              Alert.alert("Failed to delete account");
            }
          },
        },
      ]
    );
  };

  const themeStyles = darkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.header, themeStyles.text]}>Settings</Text>

      <Text style={[styles.section, themeStyles.text]}>Account</Text>
      <TouchableOpacity style={styles.item} onPress={() => router.push('/editUser')}>
        <Text style={[styles.itemText, themeStyles.text]}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
        <Text style={[styles.itemText, { color: 'red' }]}>🗑️ Delete My Account</Text>
      </TouchableOpacity>

      <Text style={[styles.section, themeStyles.text]}>🎛️ App Preferences</Text>

      <View style={styles.itemRow}>
        <Text style={[styles.itemText, themeStyles.text]}>🌙 Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.itemRow}>
        <Text style={[styles.itemText, themeStyles.text]}>🔔 Push Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <TouchableOpacity style={styles.item} onPress={() => setAboutVisible(true)}>
        <Text style={[styles.itemText, themeStyles.text]}>ℹ️ About</Text>
      </TouchableOpacity>

     

     

      <Modal visible={aboutVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About Gaia</Text>
            <Text style={styles.modalText}>
              Gaia is a smart vacation planner developed as part of a final project by Dor Yubiler and Shani Riven. All rights reserved © 2025.
            </Text>
            <TouchableOpacity onPress={() => setAboutVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
  },
  text: {
    color: '#fff',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 15,
  },
  itemText: {
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#13875B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Settings;
