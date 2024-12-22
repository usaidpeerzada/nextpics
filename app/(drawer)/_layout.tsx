// app/(drawer)/_layout.tsx
import React, { useLayoutEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useNextcloud } from "../hooks/useNextcloud";
import { usePhotos } from "../hooks/usePhotos";

export default function DrawerLayout() {
  const { fetchPhotos } = usePhotos();

  useLayoutEffect(() => {
    fetchPhotos();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "overview",
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "overview",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
