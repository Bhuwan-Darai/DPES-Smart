import { Stack } from "expo-router";

export default function AIHomeworkLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
