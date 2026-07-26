import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../../../utils/supabase";
import { useAuth } from "../../../context/AuthContext";

const PROPERTY_TYPES = ["Villa", "Penthouse", "Apartment", "House"];

export default function AddPropertyTab() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Villa");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [areaSqft, setAreaSqft] = useState("2000");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    if (!title.trim() || !price || !city.trim()) {
      setError("Please fill in the title, price, and city.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newProperty = {
        title: title.trim(),
        type,
        price: parseFloat(price),
        address: address.trim() || city.trim(),
        city: city.trim(),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        area_sqft: parseInt(areaSqft) || 0,
        images: [imageUrl.trim()],
        description: description.trim() || "Stunning property available for sale.",
        is_featured: true,
        is_sold: false,
      };

      const { error: err } = await supabase.from("properties").insert(newProperty);

      if (err) throw err;

      setTitle("");
      setPrice("");
      setAddress("");
      setCity("");
      setDescription("");

      router.replace("/(root)/(tabs)");
    } catch (e) {
      console.log("Error publishing property:", e);
      setError(e.message || "Failed to publish property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerTitle}>Add New Property 🏠</Text>
          <Text style={styles.subtitle}>List your luxury property for sale or rent</Text>

          {!isSignedIn ? (
            <View style={styles.authAlert}>
              <Text style={styles.authAlertText}>Please sign in to publish property listings.</Text>
              <TouchableOpacity 
                style={styles.signInBtn}
                onPress={() => router.push("/(auth)/sign_in")}
              >
                <Text style={styles.signInBtnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            {/* Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Property Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Modern Sunset Villa"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>

            {/* Type Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.typeRow}>
                {PROPERTY_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, type === t && styles.typeChipActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price & City */}
            <View style={styles.row}>
              <View style={styles.flexHalf}>
                <Text style={styles.label}>Price (₹ in INR)</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="13000000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.flexHalf}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Mumbai"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="14 Palm Grove Lane"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>

            {/* Bedrooms, Bathrooms, Area */}
            <View style={styles.row3}>
              <View style={styles.flexThird}>
                <Text style={styles.label}>Beds</Text>
                <TextInput
                  value={bedrooms}
                  onChangeText={setBedrooms}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.flexThird}>
                <Text style={styles.label}>Baths</Text>
                <TextInput
                  value={bathrooms}
                  onChangeText={setBathrooms}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.flexThird}>
                <Text style={styles.label}>Sqft</Text>
                <TextInput
                  value={areaSqft}
                  onChangeText={setAreaSqft}
                  keyboardType="number-pad"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Image URL */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Image URL</Text>
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>

            {/* Description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe key property features..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handlePublish}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Publish Property ✨</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20,
  },
  authAlert: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authAlertText: {
    color: "#64748B",
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  signInBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signInBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#EF4444",
    fontSize: 13,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#0F172A",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeChip: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  typeChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  typeText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  flexHalf: {
    flex: 1,
  },
  row3: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  flexThird: {
    flex: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
