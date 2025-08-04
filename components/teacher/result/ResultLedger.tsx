import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_ACADEMIC_YEARS } from "@/components/calendar/calendar-graphql";
import {
  GET_EXAMS_BY_YEAR,
  RESULT_LEDGER_TEACHER,
} from "@/lib/hooks/graphql/TeacherQueries";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

interface Exams {
  examId: string;
  examName: string;
}

interface SubjectLedger {
  subjectId: string;
  subjectName: string;
  theoryObtainMark: number;
  theoryGrade: string;
  theoryGradePoint: number;
  practicalObtainMark: number;
  practicalGrade: string;
  practicalGradePoint: number;
  totalMark: number;
  totalGrade: string;
  totalGradePoint: number;
  remarks?: string;
}

interface StudentLedger {
  studentId: string;
  studentGeneratedId: string;
  studentName: string;
  rollNumber: string;
  subjects: SubjectLedger[];
  totalMarks: number;
  totalGrade: string;
  totalGradePoint: number;
  percentage: number;
  rank: number;
}

interface ResultLedgerResponse {
  resultLedgerTeacher: {
    ledger: StudentLedger[];
    total: number;
    totalPages: number;
  };
}

interface AcademicYear {
  academicYearId: string;
  academicYear: string;
}

const ResultLedger = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [exams, setExams] = useState<Exams[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [ledgerData, setLedgerData] = useState<StudentLedger[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fetch Academic Years
  const { data: academicYearsData } = useQuery(GET_ACADEMIC_YEARS);
  useEffect(() => {
    if (academicYearsData?.getAcademicYears.data) {
      const years = academicYearsData.getAcademicYears.data;
      setAcademicYears(years);
      if (!selectedYear && years.length > 0) {
        setSelectedYear(years[0].academicYearId);
      }
    }
  }, [academicYearsData, selectedYear]);

  // Fetch Exams for Selected Year
  const { data: examsData, loading: isExamLoading } = useQuery(
    GET_EXAMS_BY_YEAR,
    {
      variables: { year: selectedYear },
      skip: !selectedYear,
    }
  );

  useEffect(() => {
    if (examsData?.findExamsByYear?.exams) {
      setExams(examsData.findExamsByYear.exams);
    }
  }, [examsData]);

  // Use query for result ledger
  const {
    data: ledgerDataResponse,
    loading: isLedgerLoading,
    error: ledgerError,
  } = useQuery<ResultLedgerResponse>(RESULT_LEDGER_TEACHER, {
    variables: {
      examId: selectedExam,
      page,
      limit,
    },
    skip: !selectedExam,
    onCompleted: (data) => {
      if (data?.resultLedgerTeacher?.ledger) {
        const newLedgerData = data.resultLedgerTeacher.ledger;

        // Sort by rank (numerically), then by totalMarks (for tie-breaking)
        const sorted = [...newLedgerData].sort((a, b) => {
          if (a.rank !== b.rank) return a.rank - b.rank;
          return b.totalMarks - a.totalMarks; // Higher marks first if rank tied
        });

        if (page === 1) {
          // First page - replace all data
          setLedgerData(sorted);
        } else {
          // Subsequent pages - append to existing data
          setLedgerData((prev) => [...prev, ...sorted]);
        }

        // Check if there are more pages
        const totalPages = data.resultLedgerTeacher.totalPages;
        setHasMore(page < totalPages);
        setTotalStudents(data.resultLedgerTeacher.total);
      }
      setIsLoadingMore(false);
    },
    onError: (error) => {
      console.log("Ledger Query Error:", error);
      setIsLoadingMore(false);
    },
  });

  console.log("Error", JSON.stringify(ledgerError, null, 2));

  // Reset data when exam is selected
  useEffect(() => {
    if (selectedExam) {
      setPage(1);
      setLedgerData([]);
      setHasMore(true);
    }
  }, [selectedExam]);

  // Handle end reached for infinite scroll
  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore && selectedExam) {
      setIsLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoadingMore, selectedExam]);

  // Optional: Log errors
  useEffect(() => {
    if (ledgerError) console.log("Ledger Query Error:", ledgerError);
  }, [ledgerError]);

  // Helper function to get grade color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "#22c55e";
      case "A":
        return "#16a34a";
      case "B+":
        return "#3b82f6";
      case "B":
        return "#1d4ed8";
      case "C+":
        return "#f59e0b";
      case "C":
        return "#d97706";
      case "D":
        return "#ef4444";
      case "F":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  // Helper function to get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "#ffd700";
    if (rank <= 3) return "#c0c0c0";
    if (rank <= 10) return "#cd7f32";
    return "#6b7280";
  };

  console.log("ledgerData", JSON.stringify(ledgerData, null, 2));

  const renderStudent = ({ item }: { item: StudentLedger }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() =>
        router.push({
          pathname: "/(teacherScreen)/resultLedger/details/[id]",
          params: { id: item.studentId, student: JSON.stringify(item) },
        })
      }
    >
      {/* Student Name and Rank Header */}
      <View style={styles.studentHeader}>
        <View style={styles.studentNameContainer}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          {/* <View
            style={[
              styles.rankBadge,
              { backgroundColor: getRankBadgeColor(item.rank) },
            ]}
          >
            <Ionicons name="trophy" size={12} color="#fff" />
            <Text style={styles.rankText}>#{item.rank}</Text>
          </View> */}
        </View>
      </View>

      {/* Student Details in Rows */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="id-card-outline" size={16} color="#667eea" />
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{item.studentGeneratedId}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="receipt-outline" size={16} color="#667eea" />
          <Text style={styles.detailLabel}>Roll:</Text>
          <Text style={styles.detailValue}>{item.rollNumber}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#22c55e" />
          <Text style={styles.detailLabel}>Marks:</Text>
          <Text style={[styles.detailValue, styles.marksValue]}>
            {item.totalMarks}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="star-outline" size={16} color="#f59e0b" />
          <Text style={styles.detailLabel}>Grade:</Text>
          <Text
            style={[
              styles.detailValue,
              styles.gradeValue,
              { color: getGradeColor(item.totalGrade) },
            ]}
          >
            {item.totalGrade}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="trending-up-outline" size={16} color="#3b82f6" />
          <Text style={styles.detailLabel}>GP:</Text>
          <Text style={styles.detailValue}>{item.totalGradePoint}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="pie-chart-outline" size={16} color="#ef4444" />
          <Text style={styles.detailLabel}>%:</Text>
          <Text style={[styles.detailValue, styles.percentageValue]}>
            {item.percentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Subject Table */}
      <View style={styles.subjectTableContainer}>
        {/* Table Header */}
        <View style={styles.subjectTableHeader}>
          <Text style={[styles.subjectCell, styles.headerText, { flex: 2 }]}>
            Subject
          </Text>
          <Text style={[styles.subjectCell, styles.headerText]}>Theory</Text>
          <Text style={[styles.subjectCell, styles.headerText]}>Practical</Text>
          <Text style={[styles.subjectCell, styles.headerText]}>Total</Text>
          <Text style={[styles.subjectCell, styles.headerText]}>Grade</Text>
          <Text style={[styles.subjectCell, styles.headerText]}>GP</Text>
        </View>

        {/* Table Rows */}
        {item.subjects && item.subjects.length > 0 ? (
          item.subjects.map((subj) => (
            <View key={subj.subjectId} style={styles.subjectTableRow}>
              <Text
                style={[
                  styles.subjectCell,
                  { flex: 2, textAlign: "left", paddingLeft: 8 },
                ]}
              >
                {subj.subjectName}
              </Text>

              {/* Theory Mark */}
              <Text style={styles.subjectCell}>
                {subj.theoryObtainMark === 0 && subj.theoryGrade === "NG"
                  ? "—"
                  : subj.theoryObtainMark}
              </Text>

              {/* Practical Mark */}
              <Text style={styles.subjectCell}>
                {subj.practicalObtainMark === 0 && subj.practicalGrade === "NG"
                  ? "—"
                  : subj.practicalObtainMark}
              </Text>

              {/* Total Mark */}
              <Text style={[styles.subjectCell, styles.totalMarkCell]}>
                {subj.totalMark === 0 && subj.totalGrade === "NG"
                  ? "—"
                  : subj.totalMark}
              </Text>

              {/* Grade */}
              <Text
                style={[
                  styles.subjectCell,
                  { color: getGradeColor(subj.totalGrade), fontWeight: "600" },
                ]}
              >
                {subj.totalGrade === "NG" ? "—" : subj.totalGrade}
              </Text>

              {/* Grade Point */}
              <Text style={styles.subjectCell}>
                {subj.totalGradePoint === 0 && subj.totalGrade === "NG"
                  ? "—"
                  : subj.totalGradePoint.toFixed(1)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.subjectTableRow}>
            <Text
              style={[
                styles.subjectCell,
                {
                  flex: 6,
                  textAlign: "center",
                  color: "#64748B",
                  fontStyle: "italic",
                },
              ]}
            >
              No subjects assigned
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Loading footer component
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <Ionicons name="hourglass-outline" size={20} color="#64748B" />
        <Text style={styles.loadingText}>Loading more students...</Text>
      </View>
    );
  };

  // Empty state component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={isLedgerLoading ? "refresh-outline" : "document-outline"}
        size={48}
        color="#64748B"
      />
      <Text style={styles.emptyText}>
        {isLedgerLoading ? "Loading results..." : "No results found."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        {/* Academic Year Picker */}
        <View style={styles.filterPill}>
          <Text style={styles.filterLabel}>Academic Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
              dropdownIconColor="#6366F1"
              enabled={academicYears.length > 0}
              mode="dropdown"
            >
              {academicYears.map((year) => (
                <Picker.Item
                  key={year.academicYearId}
                  label={year.academicYear}
                  value={year.academicYearId}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Exam Picker */}
        <View style={styles.filterPill}>
          <Text style={styles.filterLabel}>Exam</Text>
          <Picker
            selectedValue={selectedExam}
            onValueChange={setSelectedExam}
            style={styles.picker}
            dropdownIconColor="#6366F1"
            enabled={exams.length > 0}
            mode="dropdown"
          >
            {exams.map((exam) => (
              <Picker.Item
                key={exam.examId}
                label={exam.examName}
                value={exam.examId}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterPill}>
          <View style={styles.totalStudentsContainer}>
            <Ionicons name="people-outline" size={16} color="#667eea" />
            <Text style={styles.filterLabel}>Total Students</Text>
          </View>
          <Text style={styles.filterValue}>{totalStudents}</Text>
        </View>
      </View>

      {/* Student List with Infinite Scroll */}
      <FlashList
        data={ledgerData}
        renderItem={renderStudent}
        keyExtractor={(item) => item.studentId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        estimatedItemSize={280}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  filterPill: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalStudentsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#1E293B",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  studentCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  studentHeader: {
    marginBottom: 16,
  },
  studentNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rankText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    minWidth: "30%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  marksValue: {
    color: "#22c55e",
    fontWeight: "700",
  },
  gradeValue: {
    fontWeight: "700",
  },
  percentageValue: {
    color: "#ef4444",
    fontWeight: "700",
  },
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontStyle: "italic",
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#64748B",
    fontSize: 14,
  },
  subjectTableContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  subjectTableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  subjectTableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  subjectCell: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  totalMarkCell: {
    fontWeight: "600",
    color: "#1e293b",
  },
  headerText: {
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    fontSize: 12,
  },
  filterValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
});

export default ResultLedger;
