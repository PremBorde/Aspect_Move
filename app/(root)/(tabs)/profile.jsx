import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Switch,
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { useSavedProperties } from "../../../hooks/useSupabase";

export default function ProfileTab() {
  const router = useRouter();
  const { isSignedIn, user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userClerkId = user?.emailAddress || "guest_user";
  const { savedIds } = useSavedProperties(userClerkId);

  const userName = isSignedIn 
    ? `${user?.firstName || "Piyush"} ${user?.lastName || ""}`.trim() 
    : "Piyush Borde";

  const userEmail = isSignedIn 
    ? user?.emailAddress 
    : "piyush.borde@example.com";

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out 🚪",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() },
      ]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, value, onPress, isSwitch, switchVal, onSwitchChange, isDanger }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress} 
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIconContainer, isDanger && styles.dangerIconContainer]}>
        <Ionicons name={icon} size={20} color={isDanger ? "#EF4444" : "#2563EB"} />
      </View>

      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, isDanger && styles.dangerTitle]}>{title}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>

      {isSwitch ? (
        <Switch 
          value={switchVal} 
          onValueChange={onSwitchChange}
          trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
          thumbColor={switchVal ? "#2563EB" : "#94A3B8"}
        />
      ) : value ? (
        <Text style={styles.settingValueText}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Account Profile 👤</Text>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {(userName[0] || "P").toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
                <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
              
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {isSignedIn ? "VERIFIED BUYER" : "GUEST MEMBER"}
                </Text>
              </View>
            </View>
          </View>

          {/* User Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{savedIds.length}</Text>
              <Text style={styles.statLbl}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>3</Text>
              <Text style={styles.statLbl}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLbl}>Views</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Account Settings */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          {renderSettingItem({
            icon: "person-outline",
            title: "Edit Personal Profile",
            subtitle: "Update name, phone, and profile photo",
            onPress: () => Alert.alert("Profile", "Edit profile settings"),
          })}

          {renderSettingItem({
            icon: "heart-outline",
            title: "Bookmarked Properties",
            subtitle: "View your saved favorite homes",
            onPress: () => router.push("/(root)/(tabs)/saved"),
          })}

          {renderSettingItem({
            icon: "home-outline",
            title: "My Published Listings",
            subtitle: "Manage homes you listed for sale",
            onPress: () => router.push("/(root)/(tabs)/create"),
          })}
        </View>

        {/* Section 2: Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          {renderSettingItem({
            icon: "notifications-outline",
            title: "Push Notifications",
            subtitle: "Property alerts & price drop updates",
            isSwitch: true,
            switchVal: notificationsEnabled,
            onSwitchChange: setNotificationsEnabled,
          })}

          {renderSettingItem({
            icon: "globe-outline",
            title: "App Language",
            value: "English (US)",
            onPress: () => {},
          })}

          {renderSettingItem({
            icon: "shield-checkmark-outline",
            title: "Privacy & Security",
            subtitle: "Passcode & data protection",
            onPress: () => {},
          })}
        </View>

        {/* Section 3: Support */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.sectionCard}>
          {renderSettingItem({
            icon: "headset-outline",
            title: "Aspect Support Center",
            subtitle: "Contact real estate specialists 24/7",
            onPress: () => Alert.alert("Support 🎧", "Email: support@aspectmove.com\nPhone: +91 9876543210"),
          })}

          {renderSettingItem({
            icon: "document-text-outline",
            title: "Terms & Privacy Policy",
            onPress: () => {},
          })}
        </View>

        {/* Session Action Button */}
        <View style={styles.actionContainer}>
          {isSignedIn ? (
            <TouchableOpacity 
              style={styles.signOutButton} 
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.signOutButtonText}>Sign Out Account</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={() => router.push("/(auth)/sign_in")}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
              <Text style={styles.signInButtonText}>Sign In / Create Account ✨</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  roleBadgeText: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statLbl: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#CBD5E1",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  dangerIconContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  dangerTitle: {
    color: "#EF4444",
  },
  settingSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  settingValueText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  signOutButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "bold",
  },
});
