import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import {
  GET_EXAMS_BY_YEAR,
  GET_SEAT_PLAN_BY_EXAM_ID,
  VIEW_ASSIGNED_STUDENTS,
} from "@/lib/hooks/graphql/TeacherQueries";
import { GET_ACADEMIC_YEARS } from "@/components/calendar/calendar-graphql";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}


interface AcademicYear {
  academicYearId: string;
  academicYear: string;
}

interface Exam {
  examId: string;
  examName: string;
}

interface Student {
  studentId: string;
  name: string;
  rollNumber: string;
  class: string;
  className?: string;
  section: string;
  sectionName?: string;
}

interface Room {
  id: string;
  roomId: string;
  name: string;
  capacity: number;
  students: Student[];
  remainingCapacity: number;
}

interface SeatPlan {
  seatPlanId: string;
  year: string;
  examId: string;
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
}

interface AssignedStudent {
  studentId: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
}

const SeatPlan = () => {
  // states
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [seatPlan, setSeatPlan] = useState<SeatPlan | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);

  // Queries
  // academic years
  const {
    data: academicYearsData,
    loading: isAcademicYearsLoading,
    refetch: refetchAcademicYears,
  } = useQuery(GET_ACADEMIC_YEARS);

  // exams
  const {
    data: examsData,
    loading: isExamLoading,
    refetch: refetchExams,
  } = useQuery(GET_EXAMS_BY_YEAR, {
    variables: { year: selectedYear },
    skip: !selectedYear,
  });

  // seat plan
  const {
    data: seatPlanData,
    loading: isSeatPlanLoading,
    refetch: refetchSeatPlan,
  } = useQuery(GET_SEAT_PLAN_BY_EXAM_ID, {
    variables: { examId: selectedExam },
    skip: !selectedExam,
  });

  // assigned students
  const { data: assignedStudentsData, loading: assignedStudentsLoading } =
    useQuery(VIEW_ASSIGNED_STUDENTS, {
      variables: {
        input: { roomId: selectedRoom?.roomId || "" },
      },
      skip: !selectedRoom?.roomId,
    });

    console.log("assignedStudentsData", JSON.stringify(assignedStudentsData, null, 2));

  // Set academic years
  useEffect(() => {
    const years = academicYearsData?.getAcademicYears?.data || [];
    setAcademicYears(years);
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0].academicYearId);
    }
  }, [academicYearsData, selectedYear]);

  // Set exams
  useEffect(() => {
    if (examsData?.findExamsByYear?.exams) {
      setExams(examsData.findExamsByYear.exams);
    }
  }, [examsData]);

  // Set seat plan
  useEffect(() => {
    if (seatPlanData?.getSeatPlanByExamId?.seatPlan) {
      setSeatPlan(seatPlanData.getSeatPlanByExamId.seatPlan);
    }
  }, [seatPlanData, selectedExam]);

  useEffect(() => {
    if (assignedStudentsData?.viewAssignedStudents?.students) {
      setAssignedStudents(
        assignedStudentsData.viewAssignedStudents.students
      );
    }
  }, [assignedStudentsData]);

//   console.log("seatPlan", JSON.stringify(seatPlanData, null, 2));

  // Skeleton loader
  const SkeletonLoader = () => (
    <View>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={styles.skeletonItem} />
      ))}
    </View>
  );

  // Render room item
  const renderRoomItem = 
    ({ item: room }: { item: Room }) => (
      <View style={styles.roomCard}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomDetails}>
            Capacity: {room.capacity} | Remaining: {room.remainingCapacity}
          </Text>
          <Text style={styles.roomDetails}>
            Students Assigned: {room.students.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewStudentsButton} 
          onPress={() => {
            setSelectedRoom(room);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.viewStudentsButtonText}>View Students</Text>
        </TouchableOpacity>
      </View>
    );

  const StudentCard = ({ student }: { student: Student }) => (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{student.name}</Text>
      <Text style={styles.studentDetails}>
        Roll Number: {student.rollNumber}
      </Text>
      <Text style={styles.studentDetails}>
        Class: {student.class} - {student.section}
      </Text>
    </View>
  );

  // Render student modal
const renderStudentModal = () => {
    if (!selectedRoom) return null;
  
    // Extract students from assignedStudentsData
    const students : Student[] = assignedStudentsData?.viewAssignedStudents?.students || [];
   console.log("students in modal ", JSON.stringify(students, null, 2));
    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false);
          setSelectedRoom(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Students in {selectedRoom.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setSelectedRoom(null);
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {assignedStudentsLoading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ padding: 20 }} />
            ) : (
              <FlashList
                data={assignedStudents}
                renderItem={({ item }) => <StudentCard student={item} />}
                estimatedItemSize={80}
                ListEmptyComponent={
                  <Text style={styles.noStudentsText}>No students assigned</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Error boundary
  class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
  > {
    state = { hasError: false };
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    render() {
      if (this.state.hasError) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>An error occurred</Text>
            <TouchableOpacity
              onPress={() => {
                refetchAcademicYears();
                if (selectedYear) refetchExams();
                if (selectedExam) refetchSeatPlan();
              }}
            >
              <Text style={styles.retryButton}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return this.props.children;
    }
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* Academic Year Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Academic Year</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => {
              setSelectedYear(itemValue as string);
              setSelectedExam("");
              setSeatPlan(null);
            }}
            style={styles.picker}
            dropdownIconColor="#007BFF"
          >
            {isAcademicYearsLoading ? (
              <Picker.Item label="Loading..." value="" />
            ) : (
              academicYears.map((year) => (
                <Picker.Item
                  key={year.academicYearId}
                  label={year.academicYear}
                  value={year.academicYearId}
                />
              ))
            )}
          </Picker>
        </View>

        {/* Exam Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Exam</Text>
          <Picker
            selectedValue={selectedExam}
            onValueChange={(itemValue) => {
              setSelectedExam(itemValue as string);
              setSeatPlan(null);
            }}
            style={styles.picker}
            dropdownIconColor="#007BFF"
          >
            {isExamLoading ? (
              <Picker.Item label="Loading..." value="" />
            ) : (
              exams.map((exam) => (
                <Picker.Item
                  key={exam.examId}
                  label={exam.examName}
                  value={exam.examId}
                />
              ))
            )}
          </Picker>
        </View>

        {/* Room List */}
        <View style={styles.roomsContainer}>
          <Text style={styles.sectionTitle}>
            Rooms ({seatPlan?.rooms.length || 0})
          </Text>
          <FlashList
            data={seatPlan?.rooms || []}
            renderItem={renderRoomItem}
            estimatedItemSize={100}
            ListEmptyComponent={
              isSeatPlanLoading ? (
                <SkeletonLoader />
              ) : (
                <Text style={styles.noDataText}>No rooms available</Text>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={isSeatPlanLoading}
                onRefresh={() => {
                  refetchAcademicYears();
                  if (selectedYear) refetchExams();
                  if (selectedExam) refetchSeatPlan();
                }}
              />
            }
          />
        </View>

        {/* Student Modal */}
        {renderStudentModal()}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  pickerContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#007BFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
  },
  roomsContainer: {
    flex: 1,
    marginTop: 16,
  },
  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  viewStudentsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewStudentsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(245, 245, 244, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    height: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  studentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  noStudentsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  skeletonItem: {
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  studentCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default SeatPlan;
