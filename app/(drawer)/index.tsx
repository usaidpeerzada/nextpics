import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import PhotoGrid from "../components/PhotoGrid";
import { usePhotos } from "../hooks/usePhotos";
import { Ionicons } from "@expo/vector-icons"; // import Ionicons

export default function HomePage() {
  const {
    photos,
    refreshPhotos,
    uploadPhoto,
    loading,
    isRefreshing,
    error,
    isInitialized,
  } = usePhotos();

  // Handle photo upload
  const handleUploadPhoto = async () => {
    if (!isInitialized) {
      Alert.alert("Error", "Please wait for initialization to complete.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        const success = await uploadPhoto(uri);
        if (success) {
          Alert.alert("Success", "Photo uploaded successfully!");
        } else {
          Alert.alert("Error", "Failed to upload photo.");
        }
      }
    } catch (err) {
      console.error("Error picking or uploading photo:", err);
      Alert.alert("Error", "Failed to upload photo.");
    }
  };

  const renderContent = () => {
    if (!isInitialized || loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loaderText}>
            {!isInitialized
              ? "Connecting to Nextcloud..."
              : "Loading photos..."}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshPhotos}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {/* You can remove or comment out the old upload button if you don't need it */}
        {/* <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadPhoto}
        >
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity> */}

        <PhotoGrid
          photos={photos}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshPhotos}
            />
          }
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}

      {/* FAB button on the bottom-right corner */}
      {/* Render it only when initialization is done and not loading (optional condition) */}
      {!loading && isInitialized && (
        <TouchableOpacity style={styles.fabButton} onPress={handleUploadPhoto}>
          <Ionicons name="cloud-upload" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007aff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Remove or comment out if you no longer need this style:
  // uploadButton: {
  //   backgroundColor: "#007aff",
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: "center",
  //   margin: 16,
  // },
  // uploadButtonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },

  // FAB button style
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007aff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",

    // Optional: add some elevation/shadow
    elevation: 5, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.3, // iOS
    shadowRadius: 3, // iOS
  },
});
