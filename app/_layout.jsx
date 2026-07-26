import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#000000" }}>
      <AuthProvider>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#000000" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(root)" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
