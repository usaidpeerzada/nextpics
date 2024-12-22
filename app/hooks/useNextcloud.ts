import { useState, useEffect, useCallback } from "react";
import { createClient, WebDAVClient } from "webdav";
import { getCredentials } from "../utils/secureStore";
import { NextcloudCredentials, Photo, WebDAVFile } from "../interfaces/types";

const CREDENTIALS_KEY = "nextcloudCredentials";
const DEFAULT_PHOTOS_PATH = "/Photos";

export function useNextcloud() {
  const [client, setClient] = useState<WebDAVClient | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [server, setServer] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeClient = useCallback(async () => {
    if (isInitialized) return;

    try {
      const credentials = (await getCredentials(
        CREDENTIALS_KEY
      )) as NextcloudCredentials;

      if (!credentials) {
        throw new Error("No stored credentials found");
      }

      const { server, username, password } = credentials;
      setServer(server);

      const webdavClient = createClient(server, { username, password });
      if (!webdavClient) {
        throw new Error("Failed to create WebDAV client");
      }

      setClient(webdavClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize Nextcloud client"
      );
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  const normalizeUrl = useCallback((url: string): string => {
    const [protocol, path] = url.split("://");
    if (!path) return url;
    return `${protocol}://${path.replace(/\/{2,}/g, "/")}`;
  }, []);

  const fetchPhotos = useCallback(
    async (folderPath = DEFAULT_PHOTOS_PATH) => {
      if (!isInitialized) {
        await initializeClient();
      }

      if (!client || !server) {
        setError("Nextcloud client is not initialized");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const items = await client.getDirectoryContents(folderPath);
        const imageFiles = (items as WebDAVFile[]).filter((item) =>
          item.mime?.startsWith("image/")
        );

        if (imageFiles.length === 0) {
          setPhotos([]);
          return [];
        }

        const photoData = imageFiles.map((image) => ({
          uri: normalizeUrl(`${server}${image.filename}`),
        }));

        setPhotos(photoData);
        return photoData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch photos";
        setError(errorMessage);
        console.error("Fetch error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client, server, isInitialized, initializeClient, normalizeUrl]
  );

  const uploadPhoto = useCallback(
    async (localUri: string): Promise<boolean> => {
      if (!isInitialized) {
        await initializeClient();
      }

      if (!client) {
        setError("Nextcloud client is not initialized");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const fileName = localUri.split("/").pop();
        if (!fileName) {
          throw new Error("Invalid file name");
        }

        const remotePath = `${DEFAULT_PHOTOS_PATH}/${fileName}`;
        await client.putFileContents(remotePath, localUri);
        await fetchPhotos();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload photo";
        setError(errorMessage);
        console.error("Upload error:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [client, isInitialized, initializeClient, fetchPhotos]
  );

  useEffect(() => {
    initializeClient();
  }, [initializeClient]);

  return {
    photos,
    fetchPhotos,
    uploadPhoto,
    loading,
    error,
    isInitialized,
  } as const;
}
