import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import ImageViewing from "react-native-image-viewing";
import { PhotoGallery } from "react-native-photos-gallery";

const numColumns = 3;

export default function PhotoGrid({
  photos,
  refreshControl,
}: {
  photos: { uri: string }[];
  refreshControl?: JSX.Element;
}) {
  const [cachedPhotos, setCachedPhotos] = useState<
    { id: number; source: { uri: string } }[]
  >([]);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePhotoPress = (index: number) => {
    setCurrentIndex(index);
    setIsViewerVisible(true);
  };

  // Cache images locally
  const cacheImages = async () => {
    try {
      const cached = await Promise.all(
        photos.map(async (photo, index) => {
          const { uri } = photo;
          const localPath = `${FileSystem.cacheDirectory}${uri
            .split("/")
            .pop()}`;

          // Check if the image is already cached
          const fileInfo = await FileSystem.getInfoAsync(localPath);
          if (fileInfo.exists) {
            return { id: index, source: { uri: localPath } as any }; // Return the cached path
          }

          // Download and cache the image
          const downloadedImage = await FileSystem.downloadAsync(
            uri,
            localPath
          );
          return { id: index, source: { uri: downloadedImage.uri } };
        })
      );

      setCachedPhotos(cached as any);
    } catch (err) {
      console.error("Error caching images:", err);
    }
  };

  useEffect(() => {
    cacheImages();
  }, [photos]);
  console.log(cachedPhotos);
  return (
    <>
      {/* <View style={styles.container}>
        <PhotoGallery
          data={cachedPhotos}
          onImageExpand={({ visible }) => console.log(visible)}
          animatedImageDelay={60} // Reduced delay for smoother animation
          modalBackgroundStyle={styles.modalBackgroundStyle}
        />
      </View> */}
      <FlatList
        data={cachedPhotos}
        keyExtractor={(item, index) => `${item.source}-${index}`}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        refreshControl={refreshControl}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handlePhotoPress(index)}
            style={{ flex: 1, margin: 4 }}
          >
            <Image
              source={{ uri: item.source.uri }}
              style={styles.photo}
              onError={(e) =>
                setCachedPhotos((prev) => prev.filter((uri) => uri !== item))
              }
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No photos available</Text>
          </View>
        }
      />
      <ImageViewing
        images={cachedPhotos.map((uri) => ({ uri: uri.source.uri }))}
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
