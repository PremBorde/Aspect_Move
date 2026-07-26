import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Share, 
  Alert,
  Linking,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";
import { useSavedProperties } from "../../hooks/useSupabase";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

function formatPriceInINR(price) {
  const num = Number(price);
  if (isNaN(num) || !num) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(0)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const userClerkId = user?.emailAddress || "guest_user";
  const { savedIds, toggleSave } = useSavedProperties(userClerkId);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (e) {
      console.log("Error fetching property details:", e);
    } finally {
      setLoading(false);
    }
  };

  const isSaved = property ? savedIds.includes(property.id) : false;

  const handleShare = async () => {
    if (!property) return;
    try {
      await Share.share({
        message: `Check out ${property.title} in ${property.city} for ${formatPriceInINR(property.price)} on Aspect Move!`,
      });
    } catch (e) {
      console.log("Share error:", e);
    }
  };

  const handleCallAgent = () => {
    Linking.openURL("tel:+919876543210");
  };

  const handleBookTour = () => {
    Alert.alert(
      "Schedule Tour 📅",
      `Would you like to schedule a private viewing for ${property?.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm Request", 
          onPress: () => Alert.alert("Tour Requested! ✨", "An agent will contact you shortly to confirm timing.") 
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.loadingArea}>
        <Text style={styles.notFoundText}>Property not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const images = property.images?.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              if (slide !== activeImageIndex) setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
            ))}
          </ScrollView>

          {/* Gallery Pagination Dots */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, activeImageIndex === i && styles.activeDot]}
                />
              ))}
            </View>
          )}

          {/* Header Action Buttons */}
          <TouchableOpacity style={styles.topBackBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.actionIconBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionIconBtn} 
              onPress={() => toggleSave(property.id)}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={22} 
                color={isSaved ? "#EF4444" : "#0F172A"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.body}>
          {/* Title & Type */}
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{property.type || "Villa"}</Text>
            </View>
            <Text style={styles.priceText}>{formatPriceInINR(property.price)}</Text>
          </View>

          <Text style={styles.titleText}>{property.title}</Text>
          <Text style={styles.addressText}>
            <Ionicons name="location-outline" size={14} color="#64748B" /> {property.address}, {property.city}
          </Text>

          {/* Specs Bar */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Ionicons name="bed-outline" size={20} color="#2563EB" />
              <Text style={styles.specVal}>{property.bedrooms}</Text>
              <Text style={styles.specLbl}>Bedrooms</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="water-outline" size={20} color="#2563EB" />
              <Text style={styles.specVal}>{property.bathrooms}</Text>
              <Text style={styles.specLbl}>Bathrooms</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="resize-outline" size={20} color="#2563EB" />
              <Text style={styles.specVal}>{property.area_sqft}</Text>
              <Text style={styles.specLbl}>Sq Ft Area</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.descriptionText}>
            {property.description || "Experience refined modern living in this architectural masterpiece. Featuring open-concept interiors, premium finishes, and peaceful views."}
          </Text>

          {/* Agent Card */}
          <Text style={styles.sectionHeader}>Property Agent</Text>
          <View style={styles.agentCard}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>AM</Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>Aspect Move Realty</Text>
              <Text style={styles.agentRole}>Premier Property Specialist</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCallAgent}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Booking Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Listing Price</Text>
          <Text style={styles.priceValue}>{formatPriceInINR(property.price)}</Text>
        </View>

        <TouchableOpacity style={styles.bookTourBtn} onPress={handleBookTour} activeOpacity={0.8}>
          <Text style={styles.bookTourBtnText}>Schedule Tour 📅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: "#64748B",
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 110,
  },
  galleryContainer: {
    width: width,
    height: 320,
    position: "relative",
  },
  galleryImage: {
    width: width,
    height: 320,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    width: 20,
    backgroundColor: "#FFFFFF",
  },
  topBackBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topRightActions: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  actionIconBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20,
  },
  specsGrid: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  specBox: {
    alignItems: "center",
  },
  specVal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  specLbl: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 24,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  agentAvatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
  },
  agentRole: {
    fontSize: 12,
    color: "#64748B",
  },
  callBtn: {
    backgroundColor: "#2563EB",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
  },
  bookTourBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  bookTourBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
