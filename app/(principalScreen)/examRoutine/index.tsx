import { GET_ACADEMIC_YEARS } from "@/components/calendar/calendar-graphql";
import { GET_SCHOOL_EXAMINATION_BY_ACADEMIC_YEAR } from "@/lib/hooks/graphql/TeacherQueries";
import { useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const ExamRoutine = () => {
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const router = useRouter();

  const { data: academicYearsData, loading: academicYearsLoading } =
    useQuery(GET_ACADEMIC_YEARS);

  useEffect(() => {
    const years = academicYearsData?.getAcademicYears?.data || [];
    setAcademicYears(years);

    if (years.length > 0 && !selectedYearId) {
      setSelectedYearId(years[0].academicYearId); // Set default selection
    }
  }, [academicYearsData]);

  const {
    data: examsData,
    loading: examsLoading,
    error: examsError,
  } = useQuery(GET_SCHOOL_EXAMINATION_BY_ACADEMIC_YEAR, {
    variables: { academicYearId: selectedYearId },
    skip: !selectedYearId, // Skip query if no year is selected
  });

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
      case "unit test":
        return "📘"; // Book for unit of study
      case "terminal":
        return "🎓"; // Graduation cap for final exams
      case "monthly test":
        return "📅"; // Calendar for monthly recurring tests
      case "class test":
        return "📝"; // Memo/sheet for small assessments
      default:
        return "📋"; // Clipboard as fallback
    }
  };

  const renderExaminationItem = ({
    item,
    index,
  }: {
    item: Examination;
    index: number;
  }) => (
    <TouchableOpacity
      style={[styles.card, { marginTop: index === 0 ? 0 : 16 }]}
      onPress={() => {
        router.push({
          pathname: "/(teacherScreen)/examRoutine/[id]",
          params: { id: item.examinationId,  },
        });
      }}
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

  const examinations = examsData?.getSchoolExaminationByAcademicYear || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FAFAFA" />
      <View style={styles.header}>
        <Text style={styles.title}>Examinations</Text>
        <Text style={styles.subtitle}>
          Stay updated with your exam schedules
        </Text>

        {/* Picker for Academic Years */}
        {!academicYearsLoading && academicYears.length > 0 ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYearId}
              onValueChange={(itemValue) =>
                setSelectedYearId(itemValue as string)
              }
              style={styles.picker}
              dropdownIconColor="#007BFF"
            >
              {academicYears.map((year) => (
                <Picker.Item
                  key={year.academicYearId}
                  label={year.academicYear} // Display name like "2080-81"
                  value={year.academicYearId} // Store ID
                />
              ))}
            </Picker>
          </View>
        ) : null}
      </View>

      {/* Loading State */}
      {examsLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading examinations...</Text>
          </View>
        </View>
      ) : examsError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{examsError.message}</Text>
        </View>
      ) : examinations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Examinations</Text>
          <Text style={styles.emptyText}>
            No examinations found for the selected academic year.
          </Text>
        </View>
      ) : (
        <FlatList
          data={examinations}
          keyExtractor={(item) => item.examinationId}
          renderItem={renderExaminationItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

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
  pickerContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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

export default ExamRoutine;
