import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const StudentDetailsScreen = ({ student }: { student: string }) => {
  // Parse student object from string param
  const studentObj =
    typeof student === "string" ? JSON.parse(student) : student;

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

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "#ffd700";
    if (rank <= 3) return "#c0c0c0";
    if (rank <= 10) return "#cd7f32";
    return "#6b7280";
  };

  const renderSubject = ({ item }: { item: any }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectName}>{item.subjectName}</Text>
        <View
          style={[
            styles.gradeBadge,
            { backgroundColor: getGradeColor(item.totalGrade) },
          ]}
        >
          <Text style={styles.gradeBadgeText}>{item.totalGrade}</Text>
        </View>
      </View>

      <View style={styles.marksContainer}>
        <View style={styles.markItem}>
          <Ionicons name="book-outline" size={16} color="#6b7280" />
          <Text style={styles.markLabel}>Theory</Text>
          <Text style={styles.markValue}>{item.theoryObtainMark}</Text>
        </View>
        <View style={styles.markItem}>
          <Ionicons name="flask-outline" size={16} color="#6b7280" />
          <Text style={styles.markLabel}>Practical</Text>
          <Text style={styles.markValue}>{item.practicalObtainMark}</Text>
        </View>
        <View style={styles.markItem}>
          <Ionicons name="calculator-outline" size={16} color="#6b7280" />
          <Text style={styles.markLabel}>Total</Text>
          <Text style={[styles.markValue, styles.totalMark]}>
            {item.totalMark}
          </Text>
        </View>
      </View>

      <View style={styles.gradeContainer}>
        <View style={styles.gradeItem}>
          <Text style={styles.gradeLabel}>Theory Grade</Text>
          <Text
            style={[
              styles.gradeValue,
              { color: getGradeColor(item.theoryGrade) },
            ]}
          >
            {item.theoryGrade} ({item.theoryGradePoint})
          </Text>
        </View>
        <View style={styles.gradeItem}>
          <Text style={styles.gradeLabel}>Practical Grade</Text>
          <Text
            style={[
              styles.gradeValue,
              { color: getGradeColor(item.practicalGrade) },
            ]}
          >
            {item.practicalGrade} ({item.practicalGradePoint})
          </Text>
        </View>
      </View>

      {item.remarks && (
        <View style={styles.remarksContainer}>
          <Ionicons name="chatbubble-outline" size={14} color="#f59e0b" />
          <Text style={styles.remarksText}>{item.remarks}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{studentObj.studentName}'s Result</Text>
        {/* <View
          style={[
            styles.rankBadge,
            { backgroundColor: getRankBadgeColor(studentObj.rank) },
          ]}
        >
          <Ionicons name="trophy" size={16} color="#fff" />
          <Text style={styles.rankText}>Rank {studentObj.rank}</Text>
        </View> */}
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Academic Summary</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="id-card-outline" size={20} color="#667eea" />
              <Text style={styles.statLabel}>Student ID</Text>
              <Text style={styles.statValue}>
                {studentObj.studentGeneratedId}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="receipt-outline" size={20} color="#667eea" />
              <Text style={styles.statLabel}>Roll Number</Text>
              <Text style={styles.statValue}>{studentObj.rollNumber}</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#22c55e"
              />
              <Text style={styles.statLabel}>Total Marks</Text>
              <Text style={[styles.statValue, styles.highlightValue]}>
                {studentObj.totalMarks}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="star-outline" size={20} color="#f59e0b" />
              <Text style={styles.statLabel}>Grade</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: getGradeColor(studentObj.totalGrade) },
                ]}
              >
                {studentObj.totalGrade}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trending-up-outline" size={20} color="#3b82f6" />
              <Text style={styles.statLabel}>Grade Point</Text>
              <Text style={styles.statValue}>{studentObj.totalGradePoint}</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="pie-chart-outline" size={20} color="#ef4444" />
              <Text style={styles.statLabel}>Percentage</Text>
              <Text style={[styles.statValue, styles.percentageValue]}>
                {studentObj.percentage?.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="library-outline" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Subject-wise Performance</Text>
          </View>

          <FlatList
            data={studentObj.subjects}
            renderItem={renderSubject}
            keyExtractor={(item) => item.subjectId}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 12,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  rankText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  highlightValue: {
    color: "#22c55e",
    fontSize: 18,
  },
  percentageValue: {
    color: "#ef4444",
    fontSize: 18,
  },
  subjectsSection: {
    marginBottom: 20,
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    flex: 1,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gradeBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  marksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  markItem: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  markLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  markValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  totalMark: {
    color: "#667eea",
    fontSize: 18,
  },
  gradeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  gradeItem: {
    flex: 1,
    alignItems: "center",
  },
  gradeLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
  },
  gradeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  remarksContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  remarksText: {
    fontSize: 14,
    color: "#f59e0b",
    fontStyle: "italic",
    flex: 1,
  },
  list: {
    paddingBottom: 16,
  },
});

export default StudentDetailsScreen;
