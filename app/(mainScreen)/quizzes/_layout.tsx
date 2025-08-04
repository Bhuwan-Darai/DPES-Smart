import React from "react";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

export default function QuizzesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
