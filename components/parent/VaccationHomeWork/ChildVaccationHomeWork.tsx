import { GET_STUDENT_DETAILS_BY_PARENT } from "@/lib/hooks/graphql/ParentQueries";
import { useQuery } from "@apollo/client";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useRouter } from "expo-router";

export default function ChildVaccationHomeWork() {
    const { data, loading, error } = useQuery(GET_STUDENT_DETAILS_BY_PARENT);

  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        </View>
        <Text style={styles.errorText}>Unable to load student data</Text>
        <Text style={styles.errorSubtext}>
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  const students = data?.getStudentDetailsByParent?.data || [];

  console.log(JSON.stringify(students, null, 2), "data IN CHILD HOMEWORK");

  const handleCardPress = (student: any) => {
    router.push({
      pathname: "/vaccationHomeWork/[id]",
      params: { id: student?.studentId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {students.map((student: any, index: number) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(student)}
            activeOpacity={0.95}
            key={index}
          >
            {/* Header with Profile */}
            <View style={styles.cardHeader}>
              <View style={styles.profileSection}>
                {student?.studentPhotoUrl || student?.studentPhotoPath ? (
                  <Image
                    source={{
                      uri: student.studentPhotoUrl || student.studentPhotoPath,
                    }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <MaterialIcons name="person" size={32} color="#9CA3AF" />
                  </View>
                )}

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {student?.studentName || "Student Name"}
                  </Text>
                  <Text style={styles.studentId}>
                    ID: {student?.studentGeneratedId || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.chevronContainer}>
                <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </View>
            </View>

            {/* Student Details */}
            <View style={styles.detailsContainer}>
              <InfoItem
                icon="class"
                label="Class"
                value={student?.studentClass || "N/A"}
              />
              <InfoItem
                icon="group"
                label="Section"
                value={student?.studentSection || "N/A"}
              />
              <InfoItem
                icon="confirmation-number"
                label="Roll No."
                value={student?.studentRollNumber || "N/A"}
              />
            </View>

            {/* Assignment Action Hint */}
            <View style={styles.actionHint}>
              <MaterialIcons name="assignment" size={20} color="#4F46E5" />
              <Text style={styles.actionText}>View Homework</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable info item with icon
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.iconLabelContainer}>
      <MaterialIcons name={icon} size={18} color="#6B7280" />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 40,
  },
  errorIconContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#374151",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  studentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  chevronContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  value: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  actionHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
    marginLeft: 8,
  },
});
