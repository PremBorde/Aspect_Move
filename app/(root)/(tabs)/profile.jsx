import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileTab() {
  const router = useRouter();
  const { isSignedIn, user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {(user?.firstName?.[0] || "U").toUpperCase()}
            </Text>
          </View>

          <Text style={styles.title}>
            {isSignedIn ? `${user?.firstName} ${user?.lastName || ""}` : "Your Profile 👤"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignedIn ? user?.emailAddress : "Manage your account, settings, and preferences here."}
          </Text>

          {isSignedIn ? (
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={() => signOut()}
              activeOpacity={0.8}
            >
              <Text style={styles.signOutBtnText}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => router.push("/(auth)/sign_in")}
              activeOpacity={0.8}
            >
              <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#18181B",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#27272A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#A1A1AA",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  signInBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  signInBtnText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
  },
  signOutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  signOutBtnText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "bold",
  },
});
