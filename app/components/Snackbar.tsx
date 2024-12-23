import React, { useEffect, useState } from "react";
import { Animated, Text, StyleSheet } from "react-native";

interface SnackbarProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function Snackbar({
  message,
  visible,
  onDismiss,
}: SnackbarProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
      <Text style={styles.snackbarText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#323232",
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  snackbarText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
