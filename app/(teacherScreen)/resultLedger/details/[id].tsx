import { View, Text } from "react-native";
import React from "react";
import StudentDetailsScreen from "@/components/teacher/result/ResultDetails";
import { useLocalSearchParams } from "expo-router";

export default function ResultDetailsScreen() {
  const { id, student } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <StudentDetailsScreen student={student} />
    </View>
  );
}