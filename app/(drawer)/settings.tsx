// app/(drawer)/settings.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { saveCredentials, getCredentials } from "../utils/secureStore";
import { CREDENTIALS_KEY } from "../constants/globalStyles";
import { NextcloudCredentials } from "../interfaces/types";

export default function SettingsScreen() {
  const [server, setServer] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch stored credentials on load
  const loadCredentials = async () => {
    try {
      const storedCredentials = (await getCredentials(
        CREDENTIALS_KEY
      )) as NextcloudCredentials;
      if (storedCredentials) {
        setServer(storedCredentials.server || "");
        setUsername(storedCredentials.username || "");
        setPassword(storedCredentials.password || "");
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
      Alert.alert("Error", "Failed to load stored credentials.");
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  // Save credentials as a single object
  const saveNextcloudCredentials = async () => {
    setIsSaving(true);
    setIsSaved(false);

    try {
      const credentials = { server, username, password };
      await saveCredentials(CREDENTIALS_KEY, credentials);
      setIsSaved(true);
      Alert.alert("Success", "Credentials saved successfully!");
    } catch (error) {
      console.error("Error saving credentials:", error);
      Alert.alert("Error", "Failed to save credentials.");
    } finally {
      setIsSaving(false);
      setIsSaved(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nextcloud Credentials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nextcloud Credentials</Text>
        <TextInput
          style={styles.input}
          placeholder="Server URL"
          value={server}
          onChangeText={setServer}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[
            styles.saveButton,
            isSaving
              ? styles.saveButtonSaving
              : isSaved
              ? styles.saveButtonSaved
              : null,
          ]}
          onPress={saveNextcloudCredentials}
          disabled={isSaving || isSaved}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : isSaved ? (
            <Text style={styles.saveButtonText}>✔</Text>
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* General Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        <Text style={styles.placeholderText}>
          Additional settings coming soon...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // For Android shadow
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonSaving: {
    backgroundColor: "#007aff80", // Light blue when saving
  },
  saveButtonSaved: {
    backgroundColor: "#4caf50", // Green when saved
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholderText: {
    color: "#777",
    fontSize: 16,
    fontStyle: "italic",
  },
});
