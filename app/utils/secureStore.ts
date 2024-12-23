// app/utils/secureStorage.ts
import * as SecureStore from "expo-secure-store";
import { Credentials } from "../interfaces/types";

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

export async function deleteCredentials(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(
      `Error deleting credentials from Secure Store: ${key}`,
      error
    );
  }
}

export async function getSingleCredential(
  key: string,
  cred: string
): Promise<Credentials | null> {
  try {
    const vals: Credentials = (await getCredentials(key)) as Credentials;
    return vals != null ? (vals[cred] as Credentials) : null;
  } catch (error) {
    console.error(
      `Error retrieving credentials from Secure Store: ${key}`,
      error
    );
    return null;
  }
}
