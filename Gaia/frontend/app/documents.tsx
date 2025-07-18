import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Alert,
  ActivityIndicator, ScrollView, TextInput
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { useUser } from '@clerk/clerk-expo';
import config from '../config';

const api_url = config.api_url;

const Documents = () => {
  const [trips, setTrips] = useState<string[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchUserTrips(userId);
  }, [userId]);

  useEffect(() => {
    if (userId && selectedTrip) fetchDocuments(userId, selectedTrip);
  }, [selectedTrip]);

  const fetchUserTrips = async (userId: string) => {
    try {
      const response = await fetch(`${api_url}/user_trips?user_id=${userId}`);
      const data = await response.json();
      setTrips(data);
      if (data.length > 0) setSelectedTrip(data[0]);
    } catch {
      Alert.alert('Error', 'Could not fetch trip names.');
    }
  };

  const fetchDocuments = async (userId: string, tripName: string) => {
    try {
      const response = await fetch(`${api_url}/documents?user_id=${userId}&trip_name=${tripName}`);
      const data = await response.json();
      const mappedDocs = data.map((doc: any) => ({
        name: doc.filename,
        uri: `${api_url}${doc.file_url}`,
        _id: doc._id || doc.filename,
      }));
      setDocuments(mappedDocs);
    } catch {
      Alert.alert('Error', 'Could not fetch documents.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0 && userId && selectedTrip) {
        await uploadToServer(result.assets[0], userId, selectedTrip);
      }
    } catch {
      Alert.alert('Error', 'Could not pick document');
    }
  };

  const uploadToServer = async (doc: any, userId: string, tripName: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: doc.uri,
      name: doc.name,
      type: doc.mimeType || 'application/octet-stream',
    } as any);
    formData.append('user_id', userId);
    formData.append('trip_name', tripName);

    try {
      const response = await fetch(`${api_url}/upload_document`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      Alert.alert('Upload', data.message);
      fetchDocuments(userId, tripName);
    } catch {
      Alert.alert('Error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (filename: string, userId: string, tripName: string) => {
    try {
      const response = await fetch(`${api_url}/documents/${filename}?user_id=${userId}&trip_name=${tripName}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.name !== filename));
        Alert.alert('Deleted', result.message);
      } else {
        throw new Error(result.message);
      }
    } catch {
      Alert.alert('Error', 'Could not delete document.');
    }
  };

  const openDocument = async (uri: string) => {
    const supported = await Linking.canOpenURL(uri);
    if (supported) {
      Linking.openURL(uri);
    } else {
      Alert.alert('Cannot open file', 'Unsupported file type or path');
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.subtitle}>upload any document you’ll need during your trip</Text>

      <ScrollView horizontal style={styles.tripSelector} showsHorizontalScrollIndicator={false}>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip}
            style={[styles.tripChip, selectedTrip === trip && styles.tripChipSelected]}
            onPress={() => setSelectedTrip(trip)}
          >
            <Text style={selectedTrip === trip ? styles.tripTextSelected : styles.tripText}>
              {trip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      

      <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Choose Document</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#49735A" style={{ marginBottom: 20 }} />}

      <FlatList
        data={documents}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDocument(item.uri)} style={styles.card}>
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>file preview</Text>
            </View>
            <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteDocument(item.name, userId!, selectedTrip)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No documents uploaded.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: '#fff' },
  lockTitle: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 15 },
  tripSelector: { flexGrow: 0, marginBottom: 10 },
  tripChip: {
    backgroundColor: '#eee', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8, marginRight: 10,
  },
  tripChipSelected: { backgroundColor: '#49735A' },
  tripText: { color: '#000' },
  tripTextSelected: { color: '#fff', fontWeight: '600' },
  toolsBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, marginTop: 5
  },
  searchInput: {
    flex: 1, backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 10,
  },
  viewToggle: { fontSize: 20 },
  uploadButton: {
    backgroundColor: '#49735A', padding: 14, borderRadius: 20, alignItems: 'center', marginBottom: 20,
  },
  uploadButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    backgroundColor: '#F0F0F0', width: '48%', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 15,
  },
  previewBox: {
    width: '100%', height: 80, borderRadius: 6, backgroundColor: '#D3DDD5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 5,
  },
  previewText: {
    color: '#49735A', fontWeight: '500', textTransform: 'lowercase',
  },
  fileName: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  deleteText: { color: 'red', fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 20 },
});

export default Documents;
