import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
  Bus,
  Car,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_PRINCIPAL_PROFILE } from "@/lib/hooks/graphql/PrincipalQueries";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/Loading";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetails } = useAuth();
  console.log("userDetails", userDetails);
  const principalId = userDetails?.id;
  console.log("principal in profilescreen ", principalId);

  // fecth the profile
  const {
    data,
    loading: principalLoading,
    error: principalError,
    refetch: refetchPrincipal,
  } = useQuery(GET_PRINCIPAL_PROFILE, {
    variables: {
      id: principalId,
    },
    skip: !principalId,
  });

  console.log("principal data", data);
  console.log("principal principalError", JSON.stringify(principalError, null, 2));

  if (principalLoading) {
    return <LoadingSpinner />;
  }

  if (principalError) {
    return <ErrorScreen onRetry={refetchPrincipal} />;
  }

  const principal = data?.getPrincipalProfileDetails?.data;

  if (!principal) {
    return <ErrorScreen onRetry={refetchPrincipal} />;
  }

  const profileData = {
    name:
      `${principal.fullName || ""}`.trim() || "N/A",
    principalId: principal.principalId || "N/A",
    class: principal.class || "N/A",
    email: principal.email || "N/A",
    phone: principal.phone || "N/A",
    address: principal.address || "N/A",
    dateOfBirth: `${
      principal.dateOfBirthAD
        ? new Date(principal.dateOfBirthAD).toLocaleDateString()
        : "-"
    } ${"||"} ${principal.dateOfBirthBS || "N/A"}`,
    department: principal.department || "N/A",
    rollNumber: "N/A",
    admissionNumber: principal.admissionNumber || "N/A",
    ethnicity: principal.ethnicity || "N/A",
    bloodGroup: principal.bloodGroup || "N/A",
    healthIssues:   principal.healthIssues || "N/A",
    allergies: principal.allergies || "N/A",
    medications: principal.medications || "N/A",
    pickupPoint: "N/A", // Default value since field doesn't exist
    isHostelStudent: false, // Default value since field doesn't exist
    temporaryAddress: "N/A",
    permanentAddress: "N/A",
    postalCode: "N/A",
    sectionName: "N/A",
    groupName: "N/A",
    vehicleNumber: "N/A", // Default value since field doesn't exist
    status: "N/A",
  };

  // dummy data
  // const profileData = {
  //   name: "John Doe",
  //   studentId: "1234567890",
  //   class: "10",
  //   email: "john.doe@school.com",
  //   phone: "1234567890",
  //   address: "1234 Main St, Anytown, USA",
  //   dateOfBirth: "1990-01-01",
  //   sectionName: "10A",
  //   rollNumber: "1234567890",
  //   routeNumber: "1234567890",
  //   vehicleNumber: "1234567890",
  //   pickupPoint: "1234567890",
  //   bloodGroup: "1234567890",
  //   healthIssues: "1234567890",
  //   allergies: "1234567890",
  //   medications: "1234567890",
  //   isHostelStudent: true,
  //   permanentAddress: "1234 Main St, Anytown, USA",
  //   postalCode: "1234567890",
  //   status: "1234567890",
  //   ethnicity: "1234567890",
  //   groupName: "1234567890",
  //   admissionNumber: "1234567890",
  // };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 size={20} color="#007AFF" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>{profileData.name}</Text>
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.studentId}>
            Principal ID: {profileData.principalId}
          </Text>
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
                <Text style={styles.infoLabel}>Temporary Address</Text>
                <Text style={styles.infoValue}>{profileData.address}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Permanent Address</Text>
                <Text style={styles.infoValue}>
                  {profileData.permanentAddress}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{profileData.dateOfBirth}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Class</Text>
                <Text style={styles.infoValue}>{profileData.class}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Phone size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Section</Text>
                <Text style={styles.infoValue}>{profileData.sectionName}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Roll Number</Text>
                <Text style={styles.infoValue}>{profileData.rollNumber}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Roll Number</Text>
                <Text style={styles.infoValue}>{profileData.rollNumber}</Text>
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
                <Text style={styles.infoValue}>
                  {profileData.bloodGroup ? profileData.bloodGroup : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <User size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Health Issues</Text>
                <Text style={styles.infoValue}>
                  {profileData.healthIssues &&
                  profileData.healthIssues.length > 0
                    ? profileData.healthIssues
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Allergies</Text>
                <Text style={styles.infoValue}>
                  {profileData.allergies && profileData.allergies.length > 0
                    ? profileData.allergies
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <GraduationCap size={20} color="#007AFF" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Medications</Text>
                <Text style={styles.infoValue}>
                  {profileData.medications && profileData.medications.length > 0
                    ? profileData.medications
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
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{profileData.status}</Text>
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
    // marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  editButton: {
    padding: 8,
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
