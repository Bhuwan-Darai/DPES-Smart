import React from "react";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
