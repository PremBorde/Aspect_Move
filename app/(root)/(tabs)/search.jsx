import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProperties, useSavedProperties } from "../../../hooks/useSupabase";
import { useAuth } from "../../../context/AuthContext";

function formatPriceInINR(price) {
  const num = Number(price);
  if (isNaN(num) || !num) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function SearchTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { properties, loading } = useProperties({ searchQuery });
  const userClerkId = user?.emailAddress || "guest_user";
  const { savedIds, toggleSave } = useSavedProperties(userClerkId);

  const renderPropertyItem = ({ item }) => {
    const isSaved = savedIds.includes(item.id);
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
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={22} 
                color={isSaved ? "#EF4444" : "#CBD5E1"} 
              />
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
        <Text style={styles.headerTitle}>Search Properties 🔍</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by city, title, or type..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#2563EB" size="large" />
          </View>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id}
            renderItem={renderPropertyItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>No properties match your search.</Text>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 15,
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
    paddingTop: 40,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
  },
});
