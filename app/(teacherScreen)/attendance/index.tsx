import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import {
  Users,
  Check,
  X,
  AlertCircle,
  Save,
  LucideIcon,
} from "lucide-react-native";
import {
  useAttendanceDateStore,
  AttendanceDateState,
} from "../../../lib/zustand/attendanceDateStore";
import { useQuery } from "@apollo/client";
import {
  CREATE_BULK_ATTENDANCE,
  GET_STUDENTS_ATTENDANCE_CLASS_TEACHER_WISE,
  UPDATE_STUDENT_ATTENDANCE,
} from "../../../lib/hooks/graphql/TeacherQueries";
import { useMutation } from "@apollo/client";

interface Attendance {
  attendanceId: string;
  studentId: string;
  attendanceDate: string;
  status: string;
}

// Type definitions
interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentRollNumber: string;
  studentClassId: string;
  studentSectionId: string;
  studentGroupId: string;
  studentGeneratedId: string;
  attendance: Attendance[] | null;
}

interface AttendanceRecord {
  [studentId: string]: AttendanceStatus;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  notMarked: number;
}

interface AttendanceStyleConfig {
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
}

// Attendance status enum
enum AttendanceStatus {
  NOT_MARKED = "not_marked",
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
}

const AttendanceScreen: React.FC = () => {
  const selectedDate = useAttendanceDateStore(
    (state: AttendanceDateState) => state.selectedDate
  );

  const today = selectedDate || ""; // "YYYY-MM-DD"

  console.log("selectedDate in AttendanceScreen", selectedDate);

  // create the bulk attendance
  const [createBulkAttendance] = useMutation(CREATE_BULK_ATTENDANCE);

  // update student attendance
  const [updateStudentAttendance] = useMutation(UPDATE_STUDENT_ATTENDANCE);

  // Fetch students and their attendance for the selected date
  const { data, loading, error, refetch } = useQuery(
    GET_STUDENTS_ATTENDANCE_CLASS_TEACHER_WISE,
    {
      variables: { date: today },
      skip: !selectedDate,
      fetchPolicy: "network-only",
    }
  );

  console.log("data in AttendanceScreen", JSON.stringify(data, null, 2));

  // Transform fetched data to match Student[] and AttendanceRecord
  const students: Student[] =
    data?.getStudentsAttendanceClassTeacherWise?.data?.map((s: any) => ({
      studentId: s.studentId,
      studentFirstName: s.studentFirstName,
      studentLastName: s.studentLastName,
      studentRollNumber: s.studentRollNumber,
      studentClassId: s.studentClassId,
      studentSectionId: s.studentSectionId,
      studentGroupId: s.studentGroupId,
      studentGeneratedId: s.studentGeneratedId,
      attendance: s.attendance,
    })) || [];

  // AttendanceRecord from backend
  const initialAttendance: AttendanceRecord = {};
  data?.getStudentsAttendanceClassTeacherWise?.data?.forEach((s: any) => {
    const status = s.attendance?.[0]?.status; // Ensure you're accessing the first item in the array
    initialAttendance[s.studentId] = status
      ? (status as AttendanceStatus)
      : AttendanceStatus.NOT_MARKED;
  });

  console.log(
    "initialAttendance in AttendanceScreen",
    JSON.stringify(initialAttendance, null, 2)
  );

  // State for attendance, initialized from backend
  const [attendance, setAttendance] =
    useState<AttendanceRecord>(initialAttendance);
  React.useEffect(() => {
    setAttendance(initialAttendance);
  }, [data]);

  const [selectedClass, setSelectedClass] = useState<string>(""); // Not used for now

  // Handle attendance marking with triple click functionality
  const handleAttendanceClick = (studentId: string): void => {
    setAttendance((prev) => {
      const currentStatus: AttendanceStatus =
        prev[studentId] || AttendanceStatus.NOT_MARKED;
      let newStatus: AttendanceStatus;

      switch (currentStatus) {
        case AttendanceStatus.NOT_MARKED:
          newStatus = AttendanceStatus.PRESENT;
          break;
        case AttendanceStatus.PRESENT:
          newStatus = AttendanceStatus.ABSENT;
          break;
        case AttendanceStatus.ABSENT:
          newStatus = AttendanceStatus.LATE;
          break;
        case AttendanceStatus.LATE:
          newStatus = AttendanceStatus.NOT_MARKED;
          break;
        default:
          newStatus = AttendanceStatus.PRESENT;
      }

      return {
        ...prev,
        [studentId]: newStatus,
      };
    });
  };

  // Get attendance status styling
  const getAttendanceStyle = (
    status: AttendanceStatus
  ): AttendanceStyleConfig => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return {
          backgroundColor: "#E8F5E8",
          borderColor: "#4CAF50",
          iconColor: "#4CAF50",
          textColor: "#2E7D32",
        };
      case AttendanceStatus.ABSENT:
        return {
          backgroundColor: "#FFEBEE",
          borderColor: "#F44336",
          iconColor: "#F44336",
          textColor: "#C62828",
        };
      case AttendanceStatus.LATE:
        return {
          backgroundColor: "#FFF3E0",
          borderColor: "#FF9800",
          iconColor: "#FF9800",
          textColor: "#E65100",
        };
      default:
        return {
          backgroundColor: "#F8F9FA",
          borderColor: "#E0E0E0",
          iconColor: "#9E9E9E",
          textColor: "#424242",
        };
    }
  };

  // Get attendance icon
  const getAttendanceIcon = (status: AttendanceStatus): LucideIcon => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return Check;
      case AttendanceStatus.ABSENT:
        return X;
      case AttendanceStatus.LATE:
        return AlertCircle;
      default:
        return Users;
    }
  };

  // Get attendance label
  const getAttendanceLabel = (status: AttendanceStatus): string => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "Present";
      case AttendanceStatus.ABSENT:
        return "Absent";
      case AttendanceStatus.LATE:
        return "Late";
      default:
        return "Not Marked";
    }
  };

  // Calculate attendance summary
  const getAttendanceSummary = (): AttendanceSummary => {
    const summary: AttendanceSummary = {
      total: students.length,
      present: 0,
      absent: 0,
      late: 0,
      notMarked: 0,
    };
    students.forEach((student: Student) => {
      const status: AttendanceStatus =
        attendance[student.studentId] || AttendanceStatus.NOT_MARKED;
      switch (status) {
        case AttendanceStatus.PRESENT:
          summary.present++;
          break;
        case AttendanceStatus.ABSENT:
          summary.absent++;
          break;
        case AttendanceStatus.LATE:
          summary.late++;
          break;
        default:
          summary.notMarked++;
      }
    });
    return summary;
  };

  const mapFrontendStatusToBackend = (status: AttendanceStatus): string => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "p";
      case AttendanceStatus.ABSENT:
        return "a";
      case AttendanceStatus.LATE:
        return "l";
      default:
        return "n"; // Optional: handle not marked
    }
  };

  const sendAttendanceToBackend = async () => {
    // Convert the attendance object into an array of objects with studentId, date, and status
    const bulkInput = Object.entries(attendance).map(([studentId, status]) => {
      return {
        studentId: studentId,
        date: selectedDate?.toISOString().split("T")[0], // Ensure this is in 'YYYY-MM-DD' format
        status: mapFrontendStatusToBackend(status),
      };
    });

    try {
      const response = await createBulkAttendance({
        variables: {
          input: JSON.stringify(bulkInput),
        },
        onCompleted: () => {
          refetch();
        },
      });

      const result = response?.data?.createBulkAttendance;
      if (result.successCount > 0) {
        Alert.alert(
          "Success",
          `Attendance saved for ${result.successCount} students.`
        );
      }

      if (result.failedCount > 0) {
        Alert.alert(
          "Some records failed",
          `${result.failedCount} records had issues.`
        );
        console.log("Failed records:", result.errors);
      }
    } catch (error) {
      console.error("Error saving attendance:", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Failed to save attendance.");
    }
  };

  // Save attendance
  const handleSaveAttendance = async (): Promise<void> => {
    const summary: AttendanceSummary = getAttendanceSummary();

    if (summary.notMarked > 0) {
      Alert.alert(
        "Incomplete Attendance",
        `${summary.notMarked} students have not been marked. Do you want to save anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Save Anyway", onPress: sendAttendanceToBackend },
        ]
      );
    } else {
      sendAttendanceToBackend();
    }
  };

  // Mark all students with specific status
  const markAllStudents = (status: AttendanceStatus): void => {
    const newAttendance: AttendanceRecord = {};
    students.forEach((student: Student) => {
      newAttendance[student.studentId] = status;
    });
    setAttendance(newAttendance);
  };

  // Helper: Check if all students have attendance for the selected date
  const allMarked = students.every(
    (student) => student.attendance && student.attendance.length > 0
  );

  // Handler for updating all students' attendance
  const updateAllAttendance = async () => {
    try {
      // Prepare update payloads for all students
      const updatePromises = students.map((student) => {
        const att = student.attendance?.[0];
        if (!att) return null; // skip if no attendanceId
        return updateStudentAttendance({
          variables: {
            input: JSON.stringify({
              attendanceId: att.attendanceId,
              studentId: student.studentId,
              date: selectedDate?.toISOString().split("T")[0],
              status: mapFrontendStatusToBackend(attendance[student.studentId]),
            }),
          },
        });
      });

      // Filter out nulls and run all updates
      await Promise.all(updatePromises.filter(Boolean));
      refetch();
      Alert.alert("Success", "Attendance updated for all students.");
    } catch (error) {
      Alert.alert("Error", "Failed to update attendance.");
    }
  };

  const summary: AttendanceSummary = getAttendanceSummary();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Attendance Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{summary.total}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: "#4CAF50" }]}>
              {summary.present}
            </Text>
            <Text style={styles.summaryLabel}>Present</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: "#F44336" }]}>
              {summary.absent}
            </Text>
            <Text style={styles.summaryLabel}>Absent</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: "#FF9800" }]}>
              {summary.late}
            </Text>
            <Text style={styles.summaryLabel}>Late</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionBtn, { backgroundColor: "#E8F5E8" }]}
          onPress={() => markAllStudents(AttendanceStatus.PRESENT)}
        >
          <Check size={16} color="#4CAF50" />
          <Text style={[styles.quickActionText, { color: "#4CAF50" }]}>
            Mark All Present
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickActionBtn, { backgroundColor: "#FFEBEE" }]}
          onPress={() => markAllStudents(AttendanceStatus.ABSENT)}
        >
          <X size={16} color="#F44336" />
          <Text style={[styles.quickActionText, { color: "#F44336" }]}>
            Mark All Absent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to mark attendance:</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionItem}>
            • Tap once: Present (Green)
          </Text>
          <Text style={styles.instructionItem}>• Tap twice: Absent (Red)</Text>
          <Text style={styles.instructionItem}>
            • Tap thrice: Late (Orange)
          </Text>
          <Text style={styles.instructionItem}>• Tap fourth time: Reset</Text>
        </View>
      </View>

      {/* Student List */}
      <ScrollView
        style={styles.studentList}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error loading students</Text>
        ) : students.length === 0 ? (
          <Text>No students found.</Text>
        ) : (
          students.map((student: Student, index: number) => {
            const status: AttendanceStatus =
              attendance[student.studentId] || AttendanceStatus.NOT_MARKED;
            const statusStyle: AttendanceStyleConfig =
              getAttendanceStyle(status);
            const StatusIcon: LucideIcon = getAttendanceIcon(status);
            return (
              <TouchableOpacity
                key={student.studentId}
                style={[
                  styles.studentCard,
                  {
                    backgroundColor: statusStyle.backgroundColor,
                    borderColor: statusStyle.borderColor,
                  },
                ]}
                onPress={() => handleAttendanceClick(student.studentId)}
                activeOpacity={0.7}
              >
                <View style={styles.studentInfo}>
                  <View style={styles.studentDetails}>
                    <Text
                      style={[
                        styles.studentName,
                        { color: statusStyle.textColor },
                      ]}
                    >
                      {student.studentFirstName + " " + student.studentLastName}
                    </Text>
                    <Text
                      style={[
                        styles.studentRoll,
                        { color: statusStyle.textColor },
                      ]}
                    >
                      Roll No: {student.studentRollNumber}
                    </Text>
                  </View>
                  <View style={styles.attendanceStatus}>
                    <View
                      style={[
                        styles.statusIconContainer,
                        { backgroundColor: statusStyle.iconColor + "20" },
                      ]}
                    >
                      <StatusIcon size={18} color={statusStyle.iconColor} />
                    </View>
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusStyle.iconColor },
                      ]}
                    >
                      {getAttendanceLabel(status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={allMarked ? updateAllAttendance : handleSaveAttendance}
        >
          <Save size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {allMarked ? "Update Attendance" : "Save Attendance"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#666",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  instructionsList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  instructionItem: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#666",
    marginBottom: 4,
  },
  studentList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  studentCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  attendanceStatus: {
    alignItems: "center",
    minWidth: 80,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  saveContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});

export default AttendanceScreen;
