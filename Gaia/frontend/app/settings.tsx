import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";

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
              if (user) {
                await user.delete();
                Alert.alert("Account deleted");
              }
            } catch (err) {
              Alert.alert("Failed to delete account");
            }
          },
        },
      ],
    );
  };

  const themeStyles = darkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.safeArea, themeStyles.container]}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTintColor: "black",
          headerBackTitle: "back",
        }}
      />
      <View style={styles.headerContainer}>
        <Ionicons name="settings-sharp" size={32} color="#13875B" style={{ marginRight: 10 }} />
        <Text style={[styles.header, themeStyles.text]}>Settings</Text>
      </View>

      {/* Account Section */}
      <View style={styles.card}>
        <Text style={[styles.section, themeStyles.text]}>Account</Text>
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => router.push("/editUser")}
        >
          <Feather name="user" size={20} color="#13875B" style={styles.icon} />
          <Text style={[styles.itemText, themeStyles.text]}>Edit Profile</Text>
          <MaterialIcons name="keyboard-arrow-right" size={22} color="#888" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.itemRow} onPress={handleDeleteAccount}>
          <MaterialIcons name="delete-outline" size={20} color="#c64c4c" style={styles.icon} />
          <Text style={[styles.itemText, { color: "#c64c4c", fontWeight: "bold" }]}>Delete My Account</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.card}>
        <Text style={[styles.section, themeStyles.text]}>App Preferences</Text>
        <View style={styles.itemRow}>
          <Ionicons name="notifications-outline" size={20} color="#13875B" style={styles.icon} />
          <Text style={[styles.itemText, themeStyles.text]}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#13875B" : "#ccc"}
            trackColor={{ true: "#b2e5d1", false: "#eee" }}
            style={{ marginLeft: "auto" }}
          />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => setAboutVisible(true)}
        >
          <Ionicons name="information-circle-outline" size={20} color="#13875B" style={styles.icon} />
          <Text style={[styles.itemText, themeStyles.text]}>About</Text>
          <MaterialIcons name="keyboard-arrow-right" size={22} color="#888" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>
      </View>

      {/* About Modal */}
      <Modal visible={aboutVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="leaf" size={36} color="#13875B" style={{ alignSelf: "center", marginBottom: 10 }} />
            <Text style={styles.modalTitle}>About Gaia</Text>
            <Text style={styles.modalText}>
              Gaia is a smart vacation planner developed as part of a final
              project by Dor Yubiler and Shani Riven. All rights reserved ©
              2025.
            </Text>
            <TouchableOpacity
              onPress={() => setAboutVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: "#f6f8fa",
  },
  text: {
    color: "#222",
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
  },
  text: {
    color: "#fff",
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
    marginLeft: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 18,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#13875B",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  modalButton: {
    backgroundColor: "#13875B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Settings;
