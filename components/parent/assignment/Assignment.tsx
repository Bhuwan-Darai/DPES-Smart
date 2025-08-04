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

export default function Assignment() {
  const { data, loading, error } = useQuery(GET_STUDENT_DETAILS_BY_PARENT, {
    fetchPolicy: "network-only",
  });

  const router = useRouter();
  console.log(JSON.stringify(data, null, 2), "data");

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>
          Error fetching student data: {error.message}
        </Text>
      </View>
    );
  }

  const student = data?.getStudentDetailsByParent?.data?.[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            {student?.studentPhotoUrl || student?.studentPhotoPath ? (
              <Image
                source={{
                  uri: student.studentPhotoUrl || student.studentPhotoPath,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="person" size={60} color="#999" />
              </View>
            )}
          </View>

          {/* Student Info */}
          <View style={styles.infoContainer}>
            <InfoItem label="Name" value={student?.studentName} />
            <InfoItem label="Class" value={student?.studentClass} />
            <InfoItem label="Section" value={student?.studentSection} />
            <InfoItem label="Roll No." value={student?.studentRollNumber} />
            <InfoItem label="Student ID" value={student?.studentGeneratedId} />
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/assignments/[id]",
                params: { id: student?.studentId },
              })
            }
          >
            <Text style={styles.viewAttendanceButton}>View Assignment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable info item
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    width: 100,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  attendanceHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attendanceItem: {
    alignItems: "center",
  },
  day: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#777",
  },
  viewAttendanceButton: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});
