import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 🎨 Clean Light Design System Theme
const THEME = {
  primary: "#2563EB", // Blue accent for active tab
  surface: "#FFFFFF", // White floating card surface
  muted: "#94A3B8",   // Muted slate gray for inactive tab
  border: "#E2E8F0",  // Light border
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Search */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. CENTER TAB: Add Property */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property",
          tabBarIcon: () => (
            <View style={styles.centerAddButtonContainer}>
              <View style={styles.centerAddButton}>
                <Ionicons
                  name="add"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
            </View>
          ),
        }}
      />

      {/* 4. Saved */}
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={22}
              color={focused ? "#EF4444" : color}
            />
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.surface,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 20,
    marginHorizontal: 16,
    borderRadius: 32,
    height: 68,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    paddingTop: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  centerAddButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: -12,
  },
  centerAddButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
