import { ActivityIndicator, Text, View } from "react-native";
import React from "react";

export default function LoadingSpinner() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Loading</Text>
      {/* Tailwind blue-500 */}
    </View>
  );
}
