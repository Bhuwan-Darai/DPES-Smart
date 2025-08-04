import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { SCHOOL_CLASSROOM_QUERY } from "@/lib/hooks/graphql/TeacherQueries";

interface Classroom {
  classId: string;
  className: string;
  classVisible: boolean;
}

const { width } = Dimensions.get("window");

export default function ExamRoutineDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("id", id);
  const { data, loading, error } = useQuery(SCHOOL_CLASSROOM_QUERY);

  const classrooms: Classroom[] = data?.classrooms || [];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading classrooms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ Error fetching classrooms</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Classroom }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(teacherScreen)/examRoutine/class/[id]",
          params: { id: id as string, classId: item.classId },
        })
      } // 👈 Navigate on press
    >
      <Text style={styles.classTitle}>{item.className}</Text>
      {!item.classVisible && <Text style={styles.hiddenTag}>Hidden</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Classrooms</Text>

      {classrooms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No classrooms found</Text>
          <Text style={styles.emptyDescription}>
            There are no classrooms available at this time.
          </Text>
        </View>
      ) : (
        <FlatList
          data={classrooms}
          keyExtractor={(item) => item.classId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: "#007AFF",
  },
  classTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  hiddenTag: {
    marginTop: 6,
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6E6E73",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6E6E73",
    textAlign: "center",
    maxWidth: width * 0.8,
  },
});
