import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  saveCredentials,
  getCredentials,
  deleteCredentials,
} from "../utils/secureStore";
import { CREDENTIALS_KEY } from "../constants/constants";
import { NextcloudCredentials } from "../interfaces/types";
import Snackbar from "../components/Snackbar";
import { useNavigation } from "expo-router";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const [server, setServer] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

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
      showSnackbar("Failed to load stored credentials.");
    }
  };

  const deleteStoredCredentials = async () => {
    try {
      await deleteCredentials(CREDENTIALS_KEY);
      setServer("");
      setUsername("");
      setPassword("");
      showSnackbar("Credentials deleted successfully!");
    } catch (error) {
      console.error("Error deleting credentials:", error);
      showSnackbar("Failed to delete credentials.");
    }
  };

  const saveNextcloudCredentials = async () => {
    if (!server || !username || !password) {
      showSnackbar("Please fill in all fields.");
      return;
    }
    setIsSaving(true);
    setIsSaved(false);

    try {
      const credentials = { server, username, password };
      await saveCredentials(CREDENTIALS_KEY, credentials);
      setIsSaved(true);
      showSnackbar("Credentials saved successfully!");
    } catch (error) {
      console.error("Error saving credentials:", error);
      showSnackbar("Failed to save credentials.");
    } finally {
      setIsSaving(false);
      setIsSaved(true);
    }
  };

  useEffect(() => {
    loadCredentials();
    if (isFocused) {
      setIsSaved(false);
    }
  }, []);

  return (
    <View style={styles.container}>
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
        <View style={styles.buttonRow}>
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
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteStoredCredentials}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        <Text style={styles.placeholderText}>
          Additional settings coming soon...
        </Text>
      </View>

      {/* Snackbar */}
      <Snackbar
        message={snackbarMessage}
        visible={isSnackbarVisible}
        onDismiss={hideSnackbar}
      />
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
    elevation: 3,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#1e60aa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  saveButtonSaving: {
    backgroundColor: "#007aff80",
  },
  saveButtonSaved: {
    backgroundColor: "#4caf50",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  deleteButtonText: {
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
