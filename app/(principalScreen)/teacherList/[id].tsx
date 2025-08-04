import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TeacherDetails: React.FC = () => {
  const { id, details } = useLocalSearchParams();
  const rawDetails = JSON.parse(details as string);

  const detailsData = {
    ...rawDetails,
    firstName: rawDetails.fullName || "",
    lastName: "",
    studentGeneratedId: rawDetails.generatedId,
    status: rawDetails.teacherStatus,
    dateOfBirthAD: "",
    dateOfBirthBS: "",
    rollNumber: "N/A",
    studentClass: null,
    studentSection: null,
    studentGroup: [],
    temporaryAddress: {
      street: rawDetails.teacherStreetAddress || "",
    },
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1/1/1970") return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#4CAF50" : "#F44336";
  };

  const getGenderIcon = (gender: string) => {
    return gender === "male" ? "man" : "woman";
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.profileSection}>
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {getInitials(detailsData.firstName, detailsData.lastName)}
              </Text>
            </View>
            <View style={styles.genderIconContainer}>
              <Ionicons
                name={getGenderIcon(detailsData.gender)}
                size={16}
                color="#fff"
              />
            </View>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {`${detailsData.firstName || ""} ${
                detailsData.lastName || ""
              }`.trim() || "N/A"}
            </Text>
            <Text style={styles.studentId}>
              ID: {detailsData.studentGeneratedId || "N/A"}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(detailsData.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {detailsData.status?.toUpperCase() || "UNKNOWN"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.detailsContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>
              {detailsData.gender
                ? detailsData.gender.charAt(0).toUpperCase() +
                  detailsData.gender.slice(1)
                : "Not specified"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Ethnicity:</Text>
            <Text style={styles.value}>
              {rawDetails.ethnicity || "Not specified"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Joining Date:</Text>
            <Text style={styles.value}>
              {formatDate(rawDetails.joiningDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Experience:</Text>
            <Text style={styles.value}>{rawDetails.experienceYear} years</Text>
          </View>
        </View>

        {/* Teaching Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={20} color="#673AB7" />
            <Text style={styles.sectionTitle}>Teaching Information</Text>
          </View>

          {rawDetails.teacherClassAssignment?.length > 0 ? (
            rawDetails.teacherClassAssignment.map(
              (assignment: any, index: number) => (
                <View key={assignment.ClassAssignId} style={styles.detailRow}>
                  <Text style={styles.label}>
                    Class {assignment.class} {assignment.section}:
                  </Text>
                  <Text style={styles.value}>{assignment.subject}</Text>
                </View>
              )
            )
          ) : (
            <Text style={styles.value}>No class assignments</Text>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>
              {detailsData.phone || "Not provided"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>
              {detailsData.email || "Not provided"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {detailsData.temporaryAddress.street || "Not specified"}
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color="#E91E63" />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {rawDetails.teacherEmergencyContactName || "Not provided"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>
              {rawDetails.teacherEmergencyContactPhone || "Not provided"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Relationship:</Text>
            <Text style={styles.value}>
              {rawDetails.teacherEmergencyRelationship || "Not provided"}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options" size={20} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]}>
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.messageButton]}
            >
              <Ionicons name="chatbubble" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <Ionicons name="create" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { position: "relative", paddingBottom: 20 },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#2196F3",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  photoContainer: { position: "relative", marginRight: 20 },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  photoPlaceholderText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
  },
  genderIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 4 },
  studentId: {
    fontSize: 14,
    color: "#E3F2FD",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  statusContainer: { flexDirection: "row" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
  detailsContainer: { padding: 20, paddingTop: 0 },
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  label: { fontSize: 15, fontWeight: "500", color: "#666", flex: 1 },
  value: {
    fontSize: 15,
    color: "#333",
    flex: 1.5,
    textAlign: "right",
    fontWeight: "400",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
  callButton: { backgroundColor: "#4CAF50" },
  messageButton: { backgroundColor: "#2196F3" },
  editButton: { backgroundColor: "#FF9800" },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default TeacherDetails;
