import { Stack } from "expo-router";

export default function ResultLayoutParent() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
