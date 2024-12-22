import React, { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getSingleCredential } from "../utils/secureStore";
import { CREDENTIALS_KEY, USER_NAME } from "../constants/constants";
import { Credentials } from "../interfaces/types";

const CustomDrawerContent = (props: any) => {
  const { state, navigation } = props;
  const activeRoute = state.routeNames[state.index];
  const [username, setUsername] = useState<Credentials | null>(null);
  const loadUsername = async () => {
    const username = await getSingleCredential(CREDENTIALS_KEY, USER_NAME);
    setUsername(username);
  };

  useEffect(() => {
    loadUsername();
  }, []);
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={{
            uri: "https://via.placeholder.com/100", // TODO: Replace with user avatar
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>
          Hello, {username ? (username as any) : "User!"}
        </Text>
      </View>

      {/* Drawer Items */}
      {[
        {
          label: "Photos",
          route: "index",
          icon: MaterialIcons,
          iconName: "photo-library",
        },
        {
          label: "Favorites",
          route: "favorites",
          icon: Ionicons,
          iconName: "heart-outline",
        },
        {
          label: "Trash",
          route: "trash",
          icon: Ionicons,
          iconName: "trash-outline",
        },
        {
          label: "Settings",
          route: "settings",
          icon: Ionicons,
          iconName: "settings-outline",
        },
        {
          label: "Help & Support",
          route: "help",
          icon: Ionicons,
          iconName: "help-circle-outline",
        },
      ].map(({ label, route, icon: Icon, iconName }) => (
        <TouchableOpacity
          key={route}
          onPress={() => navigation.navigate(route)}
          style={[
            styles.drawerItem,
            activeRoute === route && styles.drawerItemActive,
          ]}
        >
          <Icon
            name={iconName as any}
            size={24}
            color={activeRoute === route ? "#ffffff" : "#1e3a8a"}
          />
          <Text
            style={[
              styles.drawerLabel,
              activeRoute === route && styles.drawerLabelActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f0f8ff"
        translucent={false}
      />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: "#f0f8ff" },
          headerTintColor: "#1e3a8a",
        })}
      >
        <Drawer.Screen name="index" options={{ title: "Photos" }} />
        <Drawer.Screen name="favorites" options={{ title: "Favorites" }} />
        <Drawer.Screen name="trash" options={{ title: "Trash" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="help" options={{ title: "Help & Support" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: "#1e60aa",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: "#1e60aa",
  },
  drawerLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: "#1e3a8a",
    fontWeight: "500",
  },
  drawerLabelActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
