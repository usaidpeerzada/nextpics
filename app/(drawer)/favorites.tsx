import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

const numColumns = 3;

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const [favorites, setFavorites] = useState<{ id: number; uri: string }[]>([]);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadFavorites();
  }, [isFocused]);

  const loadFavorites = async () => {
    try {
      const favoritesJSON = await AsyncStorage.getItem("favorites");
      if (favoritesJSON) {
        setFavorites(JSON.parse(favoritesJSON));
      }
    } catch (err) {
      console.error("Error loading favorite photos:", err);
    }
  };

  const handlePhotoPress = (index: number) => {
    setCurrentIndex(index);
    setIsViewerVisible(true);
  };

  return (
    <>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite photos yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `${item.id}`}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => handlePhotoPress(index)}
              style={{ flex: 1, margin: 4 }}
            >
              <Image
                source={{ uri: item.uri }}
                style={styles.photo}
                onError={() =>
                  setFavorites((prev) =>
                    prev.filter((photo) => photo.id !== item.id)
                  )
                }
              />
            </TouchableOpacity>
          )}
        />
      )}
      <ImageViewing
        images={favorites.map((photo) => ({ uri: photo.uri }))}
        imageIndex={currentIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 8,
  },
  photo: {
    flex: 1,
    margin: 4,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
