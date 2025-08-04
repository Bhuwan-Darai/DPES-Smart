import { GET_STUDENT_EXAMINATIONS_FOR_PARENT } from "@/lib/hooks/graphql/ParentQueries";
import { GET_STUDENT_EXAMINATIONS } from "@/lib/hooks/graphql/queries";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";

interface Examination {
  examinationId: string;
  examinationName: string;
  examinationType: string;
  examinationStatus: string;
  examinationStartDate: string;
  examinationEndDate: string;
  examinationYear: string;
}

const { width } = Dimensions.get("window");

export default function ExamRoutine() {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useQuery<{
    getStudentExaminationsForParent: Examination[];
  }>(GET_STUDENT_EXAMINATIONS_FOR_PARENT, {
    variables: {
      studentId: id as string,
    },
  });

  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
      case "scheduled":
        return "#FF9500";
      case "active":
      case "ongoing":
        return "#34C759";
      case "completed":
      case "finished":
        return "#8E8E93";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#007AFF";
    }
  };

  const getTypeIcon = (type: string) => {
    const normalizedType = type.toLowerCase();

    switch (normalizedType) {
      case "Unit Test":
        return "📘"; // Book for unit of study
      case "Terminal":
        return "🎓"; // Graduation cap for final exams
      case "Monthly Test":
        return "📅"; // Calendar for monthly recurring tests
      case "Class Test":
        return "📝"; // Memo/sheet for small assessments
      default:
        return "📋"; // Clipboard as fallback
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading your examinations...</Text>
          </View>
        </View>
      </SafeAreaView>
    );

  if (error)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );

  const exams = data?.getStudentExaminationsForParent || [];

  const renderItem = ({
    item,
    index,
  }: {
    item: Examination;
    index: number;
  }) => (
    <TouchableOpacity
      style={[styles.card, { marginTop: index === 0 ? 0 : 16 }]}
      onPress={() =>
        router.push({
          pathname: "/(parentScreen)/examRoutine/exam/[id]",
          params: { id: item.examinationId },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.examTypeContainer}>
          <Text style={styles.typeIcon}>
            {getTypeIcon(item.examinationType)}
          </Text>
          <Text style={styles.examType}>{item.examinationType}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.examinationStatus) },
          ]}
        >
          <Text style={styles.statusText}>{item.examinationStatus}</Text>
        </View>
      </View>

      <Text style={styles.examName}>{item.examinationName}</Text>

      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>
            {new Date(item.examinationStartDate).toLocaleDateString("en-US", {
              timeZone: "Asia/Kathmandu",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.dateSeparator} />
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>
            {new Date(item.examinationEndDate).toLocaleDateString("en-US", {
              timeZone: "Asia/Kathmandu",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.yearContainer}>
        <Text style={styles.yearLabel}>Academic Year</Text>
        <Text style={styles.yearValue}>{item.examinationYear}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <View style={styles.header}>
        <Text style={styles.title}>Examinations</Text>
        <Text style={styles.subtitle}>
          Stay updated with your exam schedule
        </Text>
      </View>

      {exams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Examinations</Text>
          <Text style={styles.emptyText}>
            You don't have any examinations scheduled at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={exams}
          keyExtractor={(item) => item.examinationId}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6E6E73",
    fontWeight: "400",
  },
  listContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  examTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  examType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6E6E73",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  examName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 16,
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateSeparator: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  yearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  yearLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6E6E73",
  },
  yearValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingWrapper: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#6E6E73",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6E6E73",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6E6E73",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: width * 0.8,
  },
});
