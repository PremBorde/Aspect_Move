import { Stack } from "expo-router";

export default function RootGroupLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "#F8FAFC" },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
