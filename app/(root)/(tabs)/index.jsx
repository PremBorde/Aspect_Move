import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Modal 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useProperties, useSavedProperties } from "../../../hooks/useSupabase";
import { useAuth } from "../../../context/AuthContext";

const CATEGORIES = ["All", "Villa", "Penthouse", "Apartment", "House"];
const PRICE_RANGES = [
  { label: "All", maxPrice: null, minPrice: null },
  { label: "< ₹1Cr", maxPrice: 10000000, minPrice: 0 },
  { label: "₹1Cr - ₹2Cr", maxPrice: 20000000, minPrice: 10000000 },
  { label: "> ₹2Cr", maxPrice: 999999999, minPrice: 20000000 },
];

function formatPriceInINR(price) {
  const num = Number(price);
  if (isNaN(num) || !num) return "₹0";
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(0)}L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [minBedrooms, setMinBedrooms] = useState(0);

  const { properties, loading, refresh } = useProperties({
    type: selectedCategory === "All" ? undefined : selectedCategory,
    searchQuery,
  });

  const filteredProperties = properties.filter((p) => {
    if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
    
    if (selectedPriceRange !== "All") {
      const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
      if (range) {
        if (range.minPrice && p.price < range.minPrice) return false;
        if (range.maxPrice && p.price > range.maxPrice) return false;
      }
    }
    return true;
  });

  const featuredProperties = filteredProperties.filter((p) => p.is_featured);
  const userClerkId = user?.emailAddress || "guest_user";
  const { savedIds, toggleSave } = useSavedProperties(userClerkId);

  const userName = user?.firstName || "Piyush";

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSelectedPriceRange("All");
    setMinBedrooms(0);
    setIsFilterModalOpen(false);
  };

  const renderFeaturedCard = ({ item }) => {
    const imageUrl = item.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

    return (
      <TouchableOpacity 
        style={styles.featuredCard} 
        onPress={() => router.push(`/properties/${item.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.featuredImage} />
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type || "Villa"}</Text>
          </View>
        </View>

        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.featuredLocation} numberOfLines={1}>
            <Ionicons name="location-outline" size={13} color="#64748B" /> {item.address || item.city}, {item.city}
          </Text>

          <View style={styles.featuredPriceRow}>
            <Text style={styles.featuredPrice}>{formatPriceInINR(item.price)}</Text>
            <View style={styles.featuredSpecs}>
              <Text style={styles.specItem}>🛏️ {item.bedrooms}</Text>
              <Text style={styles.specItem}>💧 {item.bathrooms}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendedCard = (item) => {
    const isSaved = savedIds.includes(item.id);
    const imageUrl = item.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";

    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.recommendedCard} 
        onPress={() => router.push(`/properties/${item.id}`)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUrl }} style={styles.recommendedImage} />

        <View style={styles.recommendedContent}>
          <View style={styles.recommendedTitleRow}>
            <Text style={styles.recommendedTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => toggleSave(item.id)} activeOpacity={0.8}>
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={22} 
                color={isSaved ? "#EF4444" : "#CBD5E1"} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.recommendedLocation} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color="#64748B" /> {item.city}
          </Text>

          <View style={styles.recommendedPriceRow}>
            <Text style={styles.recommendedPrice}>{formatPriceInINR(item.price)}</Text>
            <View style={styles.recommendedSpecs}>
              <Text style={styles.recommendedSpecText}>🛏️ {item.bedrooms} bd  📐 {item.area_sqft} ft²</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require("../../../assets/images/app_logo_1785056480414.png")} 
            style={styles.logoImage} 
            resizeMode="contain"
          />

          <View style={styles.userGreetingContainer}>
            <Text style={styles.greetingText}>Good Morning 👋</Text>
            <Text style={styles.userNameText}>{userName}</Text>
          </View>
        </View>

        {/* Live Search & Interactive Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search properties, cities..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={{ marginRight: 6 }}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={() => setIsFilterModalOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="options-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2563EB" size="small" />
          </View>
        ) : (
          <FlatList
            horizontal
            data={featuredProperties.length > 0 ? featuredProperties : filteredProperties}
            keyExtractor={(item) => item.id}
            renderItem={renderFeaturedCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredListContent}
          />
        )}

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
        </View>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommended Properties List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2563EB" size="large" />
          </View>
        ) : (
          <View style={styles.recommendedList}>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((item) => renderRecommendedCard(item))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No properties match your filter criteria.</Text>
                <TouchableOpacity onPress={resetAllFilters} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Properties 🎛️</Text>
              <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
                <Ionicons name="close-circle-outline" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.modalChipRow}>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  style={[
                    styles.modalChip,
                    selectedPriceRange === range.label && styles.modalChipActive,
                  ]}
                  onPress={() => setSelectedPriceRange(range.label)}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      selectedPriceRange === range.label && styles.modalChipTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionTitle}>Minimum Bedrooms</Text>
            <View style={styles.modalChipRow}>
              {[0, 1, 2, 3, 4].map((beds) => (
                <TouchableOpacity
                  key={beds}
                  style={[
                    styles.modalChip,
                    minBedrooms === beds && styles.modalChipActive,
                  ]}
                  onPress={() => setMinBedrooms(beds)}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      minBedrooms === beds && styles.modalChipTextActive,
                    ]}
                  >
                    {beds === 0 ? "Any" : `${beds}+ Beds`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.modalResetBtn} 
                onPress={resetAllFilters}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalApplyBtn} 
                onPress={() => setIsFilterModalOpen(false)}
              >
                <Text style={styles.modalApplyBtnText}>Apply Filters ✨</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  userGreetingContainer: {
    alignItems: "flex-end",
  },
  greetingText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: "#2563EB",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  featuredListContent: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  featuredCard: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredImageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  typeBadgeText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredContent: {
    padding: 14,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  featuredPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredPrice: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2563EB",
  },
  featuredSpecs: {
    flexDirection: "row",
    gap: 8,
  },
  specItem: {
    fontSize: 12,
    color: "#64748B",
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  categoryText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  recommendedList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  recommendedCard: {
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
  recommendedImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  recommendedContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  recommendedTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    flex: 1,
    marginRight: 6,
  },
  recommendedLocation: {
    fontSize: 12,
    color: "#64748B",
  },
  recommendedPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
  },
  recommendedSpecs: {
    flexDirection: "row",
  },
  recommendedSpecText: {
    fontSize: 11,
    color: "#64748B",
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 12,
  },
  resetBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  resetBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748B",
    marginTop: 12,
    marginBottom: 10,
  },
  modalChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  modalChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  modalChipText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  modalChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalResetBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalResetBtnText: {
    color: "#64748B",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalApplyBtn: {
    flex: 2,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalApplyBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
