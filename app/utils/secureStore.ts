// app/utils/secureStorage.ts
import * as SecureStore from "expo-secure-store";

// Save an object as a single key
export async function saveCredentials(key: string, value: object) {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (error) {
    console.error(`Error saving credentials to Secure Store: ${key}`, error);
  }
}

// Retrieve an object from a single key
export async function getCredentials(key: string): Promise<object | null> {
  try {
    const jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(
      `Error retrieving credentials from Secure Store: ${key}`,
      error
    );
    return null;
  }
}
