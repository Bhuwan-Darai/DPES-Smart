import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  ChevronLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Car,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_PARENT_DETAILS_BY_AUTH_ID } from "@/lib/hooks/graphql/ParentQueries";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/Loading";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetails } = useAuth();
  const studentId = userDetails?.id;

  // Fetch the parent profile
  const {
    data,
    loading: parentLoading,
    error: parentError,
    refetch: refetchParent,
  } = useQuery(GET_PARENT_DETAILS_BY_AUTH_ID, {
    variables: {
      authId: studentId,
    },
    skip: !studentId,
  });

  if (parentLoading) {
    return <LoadingSpinner />;
  }

  if (parentError) {
    return <ErrorScreen onRetry={refetchParent} />;
  }

  const parent = data?.getParentDetailsByAuthId?.data;

  if (!parent) {
    return <ErrorScreen onRetry={refetchParent} />;
  }

  // Assuming we're displaying the first student's information
  const student = parent.students[0] || {};

  const profileData = {
    name: parent.guardianName || "N/A",
    relation: parent.guardianRelation || "N/A",
    email: parent.guardianEmail || "N/A",
    phone: parent.guardianPhone || "N/A",
    status: parent.guardianStatus || "N/A",
    studentName: student.studentName || "N/A",
    studentId: student.studentGeneratedId || "N/A",
    class: student.className || "N/A",
    sectionName: student.sectionName || "N/A",
    groupNames: student.groupNames || [],
    // Fields not provided in the new data structure, set as N/A or default
    address: "N/A",
    dateOfBirth: "N/A",
    rollNumber: "N/A",
    admissionNumber: "N/A",
    ethnicity: "N/A",
    bloodGroup: "N/A",
    healthIssues: [],
    allergies: [],
    medications: [],
    pickupPoint: "N/A",
    isHostelStudent: false,
    temporaryAddress: "N/A",
    permanentAddress: "N/A",
    postalCode: "N/A",
    vehicleNumber: "N/A",
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>
              {profileData.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.studentId}>Relation: {profileData.relation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Mail size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Phone size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profileData.phone}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{profileData.address}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{profileData.status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Student Name</Text>
                <Text style={styles.infoValue}>{profileData.studentName}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Class</Text>
                <Text style={styles.infoValue}>{profileData.class}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Section</Text>
                <Text style={styles.infoValue}>{profileData.sectionName}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Student ID</Text>
                <Text style={styles.infoValue}>{profileData.studentId}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Groups</Text>
                <Text style={styles.infoValue}>
                  {profileData.groupNames.length > 0
                    ? profileData.groupNames.join(", ")
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transport Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Car size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Vehicle Number</Text>
                <Text style={styles.infoValue}>
                  {profileData.vehicleNumber}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Pickup Point</Text>
                <Text style={styles.infoValue}>{profileData.pickupPoint}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>{profileData.bloodGroup}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Health Issues</Text>
                <Text style={styles.infoValue}>
                  {profileData.healthIssues.length > 0
                    ? profileData.healthIssues.join(", ")
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Allergies</Text>
                <Text style={styles.infoValue}>
                  {profileData.allergies.length > 0
                    ? profileData.allergies.join(", ")
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Medications</Text>
                <Text style={styles.infoValue}>
                  {profileData.medications.length > 0
                    ? profileData.medications.join(", ")
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Miscellaneous Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Ethnicity</Text>
                <Text style={styles.infoValue}>{profileData.ethnicity}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Postal Code</Text>
                <Text style={styles.infoValue}>{profileData.postalCode}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Hostel Student</Text>
                <Text style={styles.infoValue}>
                  {profileData.isHostelStudent ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileInitials: {
    fontFamily: "Inter_900Black",
    fontSize: 40,
    color: "#fff",
  },
  name: {
    fontFamily: "Inter_900Black",
    fontSize: 24,
    color: "#000",
    marginBottom: 4,
  },
  studentId: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#000",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#000",
  },
});
