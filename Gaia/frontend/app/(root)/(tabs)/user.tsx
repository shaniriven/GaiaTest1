import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

import SettingsIcon from '@/assets/icons/setting.png';
import HeartIcon from '@/assets/icons/heart.png';
import DocumentIcon from '@/assets/icons/google-docs.png';
import ChatIcon from '@/assets/icons/bubble-chat.png';
import ContactIcon from '@/assets/icons/phone-call.png';
import ListIcon from '@/assets/icons/clipboard.png';

const User = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in'); 
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>                Your Profile </Text>
      </View>

      <View style={styles.buttonGrid}>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={SettingsIcon} style={styles.icon} />
            <Text style={styles.buttonText}>settings</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/likedPlaces" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={HeartIcon} style={styles.icon} />
            <Text style={styles.buttonText}>liked places</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/documents" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={DocumentIcon} style={styles.icon} />
            <Text style={styles.buttonText}>documents</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/savedChats" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={ChatIcon} style={styles.icon} />
            <Text style={styles.buttonText}>saved chats</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/contactUs" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={ContactIcon} style={styles.icon} />
            <Text style={styles.buttonText}>contact us</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/todoLists" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={ListIcon} style={styles.icon} />
            <Text style={styles.buttonText}>todo lists</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.signOutWrapper} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'left',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#49735A',
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 35,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  signOutWrapper: {
    width: '100%',
    backgroundColor: '#D32F2F',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default User;
