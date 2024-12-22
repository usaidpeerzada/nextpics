import { useState, useEffect, useCallback } from "react";
import { useNextcloud } from "./useNextcloud";
import { Photo } from "../interfaces/types";

export function usePhotos() {
  const {
    fetchPhotos: fetchNextcloudPhotos,
    uploadPhoto,
    loading: nextcloudLoading,
    error: nextcloudError,
    isInitialized,
  } = useNextcloud();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = nextcloudLoading || (!isInitialized && photos.length === 0);

  const fetchPhotos = useCallback(async () => {
    if (!isInitialized) return;

    try {
      setError(null);
      const fetchedPhotos = await fetchNextcloudPhotos();
      if (fetchedPhotos) {
        setPhotos(fetchedPhotos);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch photos";
      setError(errorMessage);
      console.error("Fetch error:", err);
    }
  }, [isInitialized, fetchNextcloudPhotos]);

  const uploadPhotoAndRefresh = useCallback(
    async (localUri: string): Promise<boolean> => {
      if (!isInitialized) {
        setError("Cannot upload photo - Nextcloud is not initialized");
        return false;
      }

      try {
        setError(null);
        const success = await uploadPhoto(localUri);
        if (success) {
          await fetchPhotos();
        }
        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload photo";
        setError(errorMessage);
        console.error("Upload error:", err);
        return false;
      }
    },
    [isInitialized, uploadPhoto, fetchPhotos]
  );

  const refreshPhotos = useCallback(async () => {
    if (!isInitialized) return;

    setIsRefreshing(true);
    try {
      await fetchPhotos();
    } finally {
      setIsRefreshing(false);
    }
  }, [isInitialized, fetchPhotos]);

  useEffect(() => {
    if (isInitialized) {
      fetchPhotos();
    }
  }, [isInitialized, fetchPhotos]);

  useEffect(() => {
    if (nextcloudError) {
      setError(nextcloudError);
    }
  }, [nextcloudError]);

  return {
    photos,
    fetchPhotos,
    uploadPhoto: uploadPhotoAndRefresh,
    refreshPhotos,
    loading,
    isRefreshing,
    error,
    isInitialized,
  } as const;
}
