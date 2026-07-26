import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSavedProperties } from "../../../hooks/useSupabase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";

function formatPriceInINR(price) {
  const num = Number(price);
  if (isNaN(num) || !num) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function SavedTab() {
  const router = useRouter();
  const { isSignedIn, user } = useAuth();

  const userClerkId = user?.emailAddress || "guest_user";
  const { savedProperties, loading, toggleSave, refresh } = useSavedProperties(userClerkId);

  const renderSavedItem = ({ item }) => {
    const imageUrl = item.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/properties/${item.id}`)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity onPress={() => toggleSave(item.id)}>
              <Ionicons name="heart" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <Text style={styles.address} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color="#64748B" /> {item.city} • {item.type}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPriceInINR(item.price)}</Text>
            <Text style={styles.specText}>🛏️ {item.bedrooms} bd  📐 {item.area_sqft} ft²</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Saved Properties 🔖</Text>

        {!isSignedIn ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>Sign In to Save Properties</Text>
            <Text style={styles.emptySubtitle}>Bookmark your favorite homes and access them anytime.</Text>
            <TouchableOpacity 
              style={styles.signInBtn}
              onPress={() => router.push("/(auth)/sign_in")}
              activeOpacity={0.8}
            >
              <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#2563EB" size="large" />
          </View>
        ) : (
          <FlatList
            data={savedProperties}
            keyExtractor={(item) => item.id}
            renderItem={renderSavedItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onRefresh={refresh}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="heart-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Saved Properties Yet</Text>
                <Text style={styles.emptySubtitle}>Tap the heart icon on any property to save it here.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    flex: 1,
    marginRight: 6,
  },
  address: {
    fontSize: 12,
    color: "#64748B",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
  },
  specText: {
    fontSize: 11,
    color: "#64748B",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
    marginBottom: 20,
  },
  signInBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  signInBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
