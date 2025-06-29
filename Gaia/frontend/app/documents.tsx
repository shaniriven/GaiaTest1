import { useUser } from "@clerk/clerk-expo";
import * as DocumentPicker from "expo-document-picker";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import config from "../config";

const api_url = config.api_url;

type DocumentItem = {
  name: string;
  uri: string;
  _id: string;
};

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchDocuments(userId);
    }
  }, [userId]);

  const fetchDocuments = async (userId: string) => {
    try {
      const response = await fetch(`${api_url}/documents?user_id=${userId}`);
      const data = await response.json();
      const mappedDocs = data.map((doc: any) => ({
        name: doc.filename,
        uri: doc.file_url,
        _id: doc._id,
      }));
      setDocuments(mappedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      Alert.alert("Error", "Could not fetch documents.");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        if (userId) {
          await uploadToServer(picked, userId);
        } else {
          Alert.alert("Error", "User not authenticated.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick document");
      console.error(error);
    }
  };

  const uploadToServer = async (
    doc: DocumentPicker.DocumentPickerAsset,
    userId: string,
  ) => {
    setUploading(true);
    const formData = new FormData();

    formData.append("file", {
      uri: doc.uri,
      name: doc.name,
      type: doc.mimeType || "application/octet-stream",
    } as any);

    formData.append("user_id", userId);

    try {
      const response = await fetch(`${api_url}/upload_document`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      Alert.alert("Upload", data.message);
      fetchDocuments(userId);
    } catch (err) {
      Alert.alert("Error", "Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (docId: string, uri: string) => {
    try {
      const response = await fetch(`${api_url}/documents/${docId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.uri !== uri));
        Alert.alert("Deleted", result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Could not delete document.");
    }
  };

  const openDocument = async (uri: string) => {
    const fullUrl = uri.startsWith("http") ? uri : `${api_url}${uri}`;
    const supported = await Linking.canOpenURL(fullUrl);
    if (supported) {
      Linking.openURL(fullUrl);
    } else {
      Alert.alert("Cannot open file", "Unsupported file type or path");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Upload Documents</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Info",
              "Here you can upload your tickets, passport scans, and every document necessary for your trip!",
            )
          }
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Choose Document</Text>
      </TouchableOpacity>

      {uploading && (
        <ActivityIndicator
          size="large"
          color="#49735A"
          style={{ marginBottom: 20 }}
        />
      )}

      <FlatList
        data={documents}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openDocument(item.uri)}
            style={styles.card}
          >
            {item.uri.match(/\.(jpg|jpeg|png)$/i) ? (
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            ) : (
              <Text style={styles.fileIcon}>📄</Text>
            )}
            <Text style={styles.fileName} numberOfLines={1}>
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => deleteDocument(item._id, item.uri)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No documents uploaded.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#49735A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#F0F0F0",
    width: "48%",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    marginBottom: 5,
    borderRadius: 4,
  },
  fileIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  deleteText: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: -16,
  },
});

export default Documents;
