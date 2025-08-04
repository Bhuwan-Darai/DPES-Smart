import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type ErrorScreenProps = {
  onRetry?: () => void;
};

export default function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-2xl font-bold text-red-600 mb-2">Oops!</Text>
      <Text className="text-base text-center text-gray-700 mb-4">
        Something went wrong. Please try again.
      </Text>
      {onRetry && (
        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded-full"
          onPress={onRetry}
      >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
