// app/components/PhotoModal.tsx
import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PhotoModal({
  photoUri,
  onClose,
}: {
  photoUri: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={!!photoUri} transparent={true} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: photoUri }} style={styles.photo} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
