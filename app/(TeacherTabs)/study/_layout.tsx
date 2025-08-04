import React from "react";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export default function AILayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle:"Curriculum",
        }}
      />
    </Stack>
  );
}
