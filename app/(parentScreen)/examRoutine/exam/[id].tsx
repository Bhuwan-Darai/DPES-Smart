import { GET_EXAM_ROUTINE_FOR_STUDENT_CLASS } from "@/lib/hooks/graphql/queries";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";

interface ExamRoutine {
  examRoutineId: string;
  examType: string;
  noticeDescription: string;
  holidayCount: number;
  startDate: string;
  endDate: string;
  schedules: ExamSchedule[];
}

interface ExamSchedule {
  subjectName: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  holidayName: string;
  examDate: string;
  theoryFullMark?: number;
  theoryPassMark?: number;
  practicalFullMark?: number;
  practicalPassMark?: number;
}

const { width } = Dimensions.get("window");

export default function ExamRoutineDetail() {
  const { id, studentId } = useLocalSearchParams();
  console.log(id, studentId, "id and studentId in examRoutineDetail");
  const { data, loading, error } = useQuery(
    GET_EXAM_ROUTINE_FOR_STUDENT_CLASS,
    {
      variables: { examId: id as string,},
      fetchPolicy: "network-only",
    }
  );

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading exam routine...</Text>
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
          <Text style={styles.errorTitle}>Unable to load routine</Text>
          <Text style={styles.errorText}>
            Please check your connection and try again
          </Text>
        </View>
      </SafeAreaView>
    );

  const routine = data?.getExamRoutineForStudentClass as ExamRoutine;
  const schedules = routine?.schedules || [];

  // Sort schedules by date and time
  const sortedSchedules = schedules.sort((a: any, b: any) => {
    const dateA = new Date(`${a.examDate} ${a.startTime}`);
    const dateB = new Date(`${b.examDate} ${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Group exams by date for better organization
  const groupedByDate = sortedSchedules.reduce(
    (acc: Record<string, typeof schedules>, schedule: any) => {
      const date = new Date(schedule.examDate).toLocaleDateString("en-US", {
        timeZone: "Asia/Kathmandu",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(schedule);
      return acc;
    },
    {}
  );

  const totalExams = schedules.length;
  const uniqueDates = Object.keys(groupedByDate).length;

  // Generate colors for different subjects
  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "#007AFF",
      "#34C759",
      "#FF9500",
      "#FF3B30",
      "#AF52DE",
      "#FF2D92",
      "#5AC8FA",
      "#FFCC00",
    ];
    const hash = subjectName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  // Get day of week
  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kathmandu",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {routine?.examType || "Examination Routine"}
          </Text>
          <Text style={styles.subtitle}>
            {routine?.noticeDescription || "Examination Routine"}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalExams}</Text>
            <Text style={styles.statLabel}>Total Exams</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uniqueDates}</Text>
            <Text style={styles.statLabel}>Exam Days</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {schedules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No Exams Scheduled</Text>
            <Text style={styles.emptyText}>
              There are no exams scheduled for this routine yet.
            </Text>
          </View>
        ) : (
          <View style={styles.examsList}>
            {Object.entries(groupedByDate).map(([date, exams], dateIndex) => (
              <View
                key={date}
                style={[
                  styles.dateSection,
                  { marginTop: dateIndex === 0 ? 0 : 24 },
                ]}
              >
                {/* Date Header */}
                <View style={styles.dateHeader}>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateText}>{date}</Text>
                    <Text style={styles.dayText}>
                      {getDayOfWeek(exams[0].examDate)}
                    </Text>
                  </View>
                  <View style={styles.examCount}>
                    <Text style={styles.examCountText}>{exams.length}</Text>
                  </View>
                </View>

                {/* Exams for this date */}
                {exams.map((exam: any, examIndex: number) => (
                  <View
                    key={`${exam.subjectName}-${examIndex}`}
                    style={styles.examCard}
                  >
                    <View
                      style={[
                        styles.subjectColorBar,
                        { backgroundColor: getSubjectColor(exam.subjectName) },
                      ]}
                    />

                    <View style={styles.examContent}>
                      <View style={styles.examHeader}>
                        <Text style={styles.subjectName} numberOfLines={2}>
                          {exam.subjectName}
                        </Text>
                        <View
                          style={[
                            styles.timeBadge,
                            {
                              backgroundColor: getSubjectColor(
                                exam.subjectName
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.timeBadgeText}>
                            {exam.startTime} - {exam.endTime}
                          </Text>
                        </View>
                      </View>

                      {/* Show marks if not a holiday */}
                      {!exam.isHoliday && (
                        <View style={{ marginBottom: 8 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#6E6E73",
                              fontWeight: "500",
                            }}
                          >
                            Theory: {exam.theoryFullMark ?? "-"} (Pass:{" "}
                            {exam.theoryPassMark ?? "-"})
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#6E6E73",
                              fontWeight: "500",
                            }}
                          >
                            Practical: {exam.practicalFullMark ?? "-"} (Pass:{" "}
                            {exam.practicalPassMark ?? "-"})
                          </Text>
                        </View>
                      )}

                      {exam.room && (
                        <View style={styles.examDetails}>
                          <Text style={styles.detailIcon}>📍</Text>
                          <Text style={styles.detailText}>
                            Room: {exam.room}
                          </Text>
                        </View>
                      )}

                      {exam.duration && (
                        <View style={styles.examDetails}>
                          <Text style={styles.detailIcon}>⏱️</Text>
                          <Text style={styles.detailText}>
                            Duration: {exam.duration}
                          </Text>
                        </View>
                      )}

                      {exam.examType && (
                        <View style={styles.examDetails}>
                          <Text style={styles.detailIcon}>📝</Text>
                          <Text style={styles.detailText}>
                            Type: {exam.examType}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    marginBottom: 20,
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
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6E6E73",
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  examsList: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 2,
  },
  dayText: {
    fontSize: 14,
    color: "#6E6E73",
    fontWeight: "500",
  },
  examCount: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 32,
    alignItems: "center",
  },
  examCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  examCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    flexDirection: "row",
    overflow: "hidden",
  },
  subjectColorBar: {
    width: 4,
  },
  examContent: {
    flex: 1,
    padding: 20,
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  examDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#6E6E73",
    fontWeight: "500",
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
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
