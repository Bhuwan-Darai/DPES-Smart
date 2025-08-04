import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const StudentResultApp = () => {
  // Sample student data following Nepal SEE system
  const studentData = {
    personalInfo: {
      name: "Rajesh Kumar Sharma",
      rollNo: "2024/075/001",
      registrationNo: "240750012345",
      class: "Grade 10",
      section: "A",
      school: "Kathmandu Model Secondary School",
      examYear: "2024",
      board: "National Examination Board (NEB)",
    },
    subjects: [
      {
        name: "English",
        code: "ENG 012",
        theory: { fullMarks: 75, obtainedMarks: 68, grade: "A", gpa: 3.6 },
        practical: { fullMarks: 25, obtainedMarks: 22, grade: "A", gpa: 3.6 },
        total: { fullMarks: 100, obtainedMarks: 90, grade: "A+", gpa: 4.0 },
      },
      {
        name: "Nepali",
        code: "NEP 011",
        theory: { fullMarks: 75, obtainedMarks: 61, grade: "B+", gpa: 3.2 },
        practical: { fullMarks: 25, obtainedMarks: 20, grade: "B+", gpa: 3.2 },
        total: { fullMarks: 100, obtainedMarks: 81, grade: "A", gpa: 3.6 },
      },
      {
        name: "Mathematics",
        code: "MTH 016",
        theory: { fullMarks: 75, obtainedMarks: 58, grade: "B", gpa: 2.8 },
        practical: { fullMarks: 25, obtainedMarks: 18, grade: "B", gpa: 2.8 },
        total: { fullMarks: 100, obtainedMarks: 76, grade: "B+", gpa: 3.2 },
      },
      {
        name: "Science",
        code: "SCI 054",
        theory: { fullMarks: 75, obtainedMarks: 64, grade: "B", gpa: 2.8 },
        practical: { fullMarks: 25, obtainedMarks: 21, grade: "A", gpa: 3.6 },
        total: { fullMarks: 100, obtainedMarks: 85, grade: "A", gpa: 3.6 },
      },
      {
        name: "Social Studies",
        code: "SOC 055",
        theory: { fullMarks: 75, obtainedMarks: 56, grade: "C+", gpa: 2.4 },
        practical: { fullMarks: 25, obtainedMarks: 19, grade: "B+", gpa: 3.2 },
        total: { fullMarks: 100, obtainedMarks: 75, grade: "B+", gpa: 3.2 },
      },
      {
        name: "Health & Physical Education",
        code: "HPE 056",
        theory: { fullMarks: 75, obtainedMarks: 66, grade: "B", gpa: 2.8 },
        practical: { fullMarks: 25, obtainedMarks: 23, grade: "A+", gpa: 4.0 },
        total: { fullMarks: 100, obtainedMarks: 89, grade: "A", gpa: 3.6 },
      },
      {
        name: "Optional Mathematics",
        code: "OPT 057",
        theory: { fullMarks: 75, obtainedMarks: 52, grade: "C+", gpa: 2.4 },
        practical: { fullMarks: 25, obtainedMarks: 18, grade: "B", gpa: 2.8 },
        total: { fullMarks: 100, obtainedMarks: 70, grade: "B+", gpa: 3.2 },
      },
      {
        name: "Computer Science",
        code: "CS 058",
        theory: { fullMarks: 75, obtainedMarks: 69, grade: "A", gpa: 3.6 },
        practical: { fullMarks: 25, obtainedMarks: 24, grade: "A+", gpa: 4.0 },
        total: { fullMarks: 100, obtainedMarks: 93, grade: "A+", gpa: 4.0 },
      },
    ],
    overallResult: {
      totalFullMarks: 800,
      totalObtainedMarks: 663,
      percentage: 82.88,
      overallGrade: "A",
      gpa: 3.3,
      division: "First Division",
      result: "PASS",
    },
  };

  const [activeTab, setActiveTab] = useState("details");

  const getGradeColor = (grade: string) => {
    const colors = {
      "A+": "#10B981",
      A: "#059669",
      "B+": "#3B82F6",
      B: "#2563EB",
      "C+": "#F59E0B",
      C: "#D97706",
      D: "#EF4444",
      NG: "#991B1B",
    };
    return colors[grade as keyof typeof colors] || "#6B7280";
  };

  const GradeDisplay = ({ grade, gpa }: { grade: string; gpa: number }) => (
    <View
      style={[styles.gradeBadge, { backgroundColor: getGradeColor(grade) }]}
    >
      <Text style={styles.gradeText}>{grade}</Text>
      <Text style={styles.gpaText}>({gpa})</Text>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const SubjectCard = ({ subject, index }: { subject: any; index: number }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.subjectCode}>{subject.code}</Text>
      </View>

      <View style={styles.marksContainer}>
        {/* Theory */}
        <View style={styles.marksSection}>
          <Text style={styles.sectionTitle}>Theory</Text>
          <View style={styles.marksRow}>
            <Text style={styles.marksText}>
              {subject.theory.obtainedMarks}/{subject.theory.fullMarks}
            </Text>
            <GradeDisplay
              grade={subject.theory.grade}
              gpa={subject.theory.gpa}
            />
          </View>
        </View>

        {/* Practical */}
        <View style={styles.marksSection}>
          <Text style={styles.sectionTitle}>Practical</Text>
          <View style={styles.marksRow}>
            <Text style={styles.marksText}>
              {subject.practical.obtainedMarks}/{subject.practical.fullMarks}
            </Text>
            <GradeDisplay
              grade={subject.practical.grade}
              gpa={subject.practical.gpa}
            />
          </View>
        </View>

        {/* Total */}
        <View style={[styles.marksSection, styles.totalSection]}>
          <Text style={styles.totalTitle}>Total</Text>
          <View style={styles.marksRow}>
            <Text style={styles.totalMarksText}>
              {subject.total.obtainedMarks}/{subject.total.fullMarks}
            </Text>
            <GradeDisplay grade={subject.total.grade} gpa={subject.total.gpa} />
          </View>
        </View>
      </View>
    </View>
  );

  const GradingTable = () => {
    const gradingData = [
      {
        range: "90% सम्मा माथि",
        gpa: "4.0",
        grade: "A+",
        desc: "गजबको (Outstanding)",
      },
      { range: "80-89%", gpa: "3.6", grade: "A", desc: "उत्कृष्ट (Excellent)" },
      {
        range: "70-79%",
        gpa: "3.2",
        grade: "B+",
        desc: "उत्कृष्ट (Very good)",
      },
      { range: "60-69%", gpa: "2.8", grade: "B", desc: "राम्रो (Good)" },
      {
        range: "50-59%",
        gpa: "2.4",
        grade: "C+",
        desc: "सन्तोषजनक (Satisfactory)",
      },
      { range: "40-49%", gpa: "2.0", grade: "C", desc: "ग्राह्य (Acceptable)" },
      { range: "35-39%", gpa: "1.6", grade: "D", desc: "आधारभूत (Basic)" },
      {
        range: "35% भन्दा कम",
        gpa: "-",
        grade: "NG",
        desc: "अवर्गीकृत (Not Graded)",
      },
    ];

    return (
      <View style={styles.gradingTable}>
        <Text style={styles.gradingTitle}>SEE Grading System in Nepal</Text>
        <Text style={styles.gradingSubtitle}>
          Secondary Education Examination (SEE)
        </Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>
            Achievement %
          </Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>GPA</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Grade</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
        </View>

        {gradingData.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
          >
            <Text style={[styles.tableCellText, { flex: 2 }]}>
              {item.range}
            </Text>
            <Text
              style={[
                styles.tableCellText,
                { flex: 1, textAlign: "center", fontWeight: "bold" },
              ]}
            >
              {item.gpa}
            </Text>
            <View style={[styles.tableCellGrade, { flex: 1 }]}>
              <View
                style={[
                  styles.miniGradeBadge,
                  { backgroundColor: getGradeColor(item.grade) },
                ]}
              >
                <Text style={styles.miniGradeText}>{item.grade}</Text>
              </View>
            </View>
            <Text style={[styles.tableCellText, { flex: 2, fontSize: 11 }]}>
              {item.desc}
            </Text>
          </View>
        ))}

        <View style={styles.tableFooter}>
          <Text style={styles.footerText}>
            * National Examination Board (NEB), Nepal
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F2937" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Exam Result</Text>
        <Text style={styles.headerSubtitle}>
          Academic Year {studentData.personalInfo.examYear}
        </Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "details" && styles.activeTab]}
          onPress={() => setActiveTab("details")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "details" && styles.activeTabText,
            ]}
          >
            Student Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "results" && styles.activeTab]}
          onPress={() => setActiveTab("results")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "results" && styles.activeTabText,
            ]}
          >
            Exam Results
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "grading" && styles.activeTab]}
          onPress={() => setActiveTab("grading")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "grading" && styles.activeTabText,
            ]}
          >
            Grading System
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Student Details Tab */}
        {activeTab === "details" && (
          <View style={styles.tabContent}>
            {/* Personal Information Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>👤 Personal Information</Text>
              </View>
              <View style={styles.cardBody}>
                <InfoRow label="Name" value={studentData.personalInfo.name} />
                <InfoRow
                  label="Roll No"
                  value={studentData.personalInfo.rollNo}
                />
                <InfoRow
                  label="Registration"
                  value={studentData.personalInfo.registrationNo}
                />
                <InfoRow label="Class" value={studentData.personalInfo.class} />
                <InfoRow
                  label="Section"
                  value={studentData.personalInfo.section}
                />
                <InfoRow
                  label="School"
                  value={studentData.personalInfo.school}
                />
                <InfoRow label="Board" value={studentData.personalInfo.board} />
              </View>
            </View>

            {/* Overall Performance Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🏆 Overall Performance</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.overallStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {studentData.overallResult.percentage}%
                    </Text>
                    <Text style={styles.statLabel}>Percentage</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text
                      style={[
                        styles.statValue,
                        {
                          color: getGradeColor(
                            studentData.overallResult.overallGrade
                          ),
                        },
                      ]}
                    >
                      {studentData.overallResult.overallGrade}
                    </Text>
                    <Text style={styles.statLabel}>Grade</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {studentData.overallResult.gpa}
                    </Text>
                    <Text style={styles.statLabel}>GPA</Text>
                  </View>
                </View>

                <View style={styles.resultStatus}>
                  <Text
                    style={[
                      styles.resultText,
                      {
                        color:
                          studentData.overallResult.result === "PASS"
                            ? "#10B981"
                            : "#EF4444",
                      },
                    ]}
                  >
                    {studentData.overallResult.result}
                  </Text>
                  <Text style={styles.divisionText}>
                    {studentData.overallResult.division}
                  </Text>
                  <Text style={styles.totalMarksText}>
                    {studentData.overallResult.totalObtainedMarks}/
                    {studentData.overallResult.totalFullMarks}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📚 Subject-wise Results</Text>
              </View>
              <View style={styles.cardBody}>
                {studentData.subjects.map((subject, index) => (
                  <SubjectCard key={index} subject={subject} index={index} />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Grading System Tab */}
        {activeTab === "grading" && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📊 Grading Reference</Text>
              </View>
              <View style={styles.cardBody}>
                <GradingTable />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#1F2937",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  overallStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  resultStatus: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divisionText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  totalMarksText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  subjectCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  subjectCode: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  marksContainer: {
    gap: 8,
  },
  marksSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    paddingTop: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  totalTitle: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "bold",
    flex: 1,
  },
  marksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  marksText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
    minWidth: 50,
    textAlign: "right",
  },
  gradeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: "center",
  },
  gradeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  gpaText: {
    color: "#FFFFFF",
    fontSize: 10,
    marginLeft: 3,
  },
  gradingTable: {
    width: "100%",
  },
  gradingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  gradingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  tableCellText: {
    fontSize: 11,
    color: "#374151",
    textAlign: "left",
  },
  tableCellGrade: {
    alignItems: "center",
    justifyContent: "center",
  },
  miniGradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    minWidth: 30,
    alignItems: "center",
  },
  miniGradeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  tableFooter: {
    paddingTop: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#6B7280",
    fontStyle: "italic",
  },
});

export default StudentResultApp;
