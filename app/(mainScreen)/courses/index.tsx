import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ComingSoonComponent from "@/components/ui/ComingSoon";

export default function CoursesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ComingSoonComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  materialButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 4,
  },
});
