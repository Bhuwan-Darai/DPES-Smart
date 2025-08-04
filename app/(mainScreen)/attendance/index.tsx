import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import NepaliCalendar from "@/components/ui/NepaliCalander";
import { GET_STUDENT_ATTENDANCE } from "@/lib/hooks/graphql/queries";
import { useQuery } from "@apollo/client";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function AttendanceScreen() {
  const router = useRouter();

  // Fetch attendance data
  const {
    data,
    loading: studentLoading,
    error: studentError,
    refetch: refetchStudent,
  } = useQuery(GET_STUDENT_ATTENDANCE);

  // Extract attendance data
  const attendanceData = data?.getAttendanceDetailsStudentWise?.data;

  // Prepare attendance dates for NepaliCalendar
  const attendanceDates =
    attendanceData?.attendance?.map((record: any) => ({
      date: new Date(record.date),
      status: record.status,
    })) || [];

  // Handle loading and error states
  if (studentLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (studentError) {
    return (
      <View style={styles.container}>
        <ErrorScreen onRetry={refetchStudent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Calendar size={24} color="#007AFF" />
            <Text style={styles.overviewTitle}>Overall Attendance</Text>
          </View>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {attendanceData?.averageAttendance || "N/A"}%
              </Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {attendanceData?.totalClassAttended || "N/A"}
              </Text>
              <Text style={styles.statLabel}>Classes Attended</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {attendanceData?.totalClassMissed || "N/A"}
              </Text>
              <Text style={styles.statLabel}>Classes Missed</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Attendance Records</Text>
        {attendanceData?.attendance?.length ? (
          attendanceData.attendance.map((record: any, index: number) => (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        record.status === "present"
                          ? "#34C759"
                          : record.status === "late"
                          ? "#FF9500"
                          : "#FF2D55",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.detailText}>No attendance records found.</Text>
        )}

        <NepaliCalendar
          attendanceDates={attendanceDates}
          currentDate={new Date()}
        />

        {attendanceData?.averageAttendance &&
          parseFloat(attendanceData.averageAttendance) < 85 && (
            <View style={styles.warningCard}>
              <AlertCircle size={24} color="#FF9500" />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Attendance Warning</Text>
                <Text style={styles.warningText}>
                  Your attendance is below 85%. Please ensure regular attendance
                  to maintain academic progress.
                </Text>
              </View>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

// Styles remain the same as provided
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginLeft: 8,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#fff",
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginLeft: 4,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FF9500",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    lineHeight: 20,
  },
});
