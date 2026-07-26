import React, { useEffect, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ActivityIndicator, 
  Animated 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Smooth Fade In & Spring Scale Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirect to main tabs after 1.8 seconds
    const timer = setTimeout(() => {
      router.replace("/(root)/(tabs)");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content, 
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Image
          source={require("../assets/images/app_logo_1785056480414.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandTitle}>ASPECT MOVE</Text>
        <Text style={styles.brandSubtitle}>LUXURY REAL ESTATE</Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563EB",
    letterSpacing: 4,
    marginBottom: 30,
  },
  loaderContainer: {
    marginTop: 10,
  },
});
