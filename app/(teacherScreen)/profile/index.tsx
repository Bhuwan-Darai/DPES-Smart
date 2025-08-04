import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
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
  Heart,
  AlertCircle,
  Pill,
  Clock,
  Shield,
  Award,
  UserCheck,
  DotIcon,
  Info,
  MagnetIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_STUDENT_BY_ID } from "@/lib/graphql/profile";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/Loading";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { GET_TEACHER_PROFILE } from "@/lib/hooks/graphql/TeacherQueries";
import { IconSymbol } from "@/components/ui/IconSymbol";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { userDetails } = useAuth();
  const teacherId = userDetails?.id;

  const {
    data,
    loading: teacherLoading,
    error: teacherError,
    refetch: refetchTeacher,
  } = useQuery(GET_TEACHER_PROFILE, {
    variables: {
      id: teacherId,
    },
    skip: !teacherId,
    fetchPolicy: "network-only",
  });

  if (teacherLoading) {
    return <LoadingSpinner />;
  }

  if (teacherError) {
    return <ErrorScreen onRetry={refetchTeacher} />;
  }

  const teacher = data?.getTeacherProfileDetails?.data;

  if (!teacher) {
    return <ErrorScreen onRetry={refetchTeacher} />;
  }

  // Fixed and enhanced profile data mapping
  const profileData = {
    name: teacher.fullName || "N/A",
    teacherId: teacher.generatedId || "N/A",
    email: teacher.email || "N/A",
    phone: teacher.phone || "N/A",
    temporaryAddress: teacher.temporaryStreetAddress || "N/A",
    permanentAddress: teacher.permanentStreetAddress || "N/A",
    dateOfBirth: teacher.dateOfBirthAD
      ? new Date(teacher.dateOfBirthAD).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A",
    dateOfBirthBS: teacher.dateOfBirthBS || "N/A",
    bloodGroup: teacher.bloodGroup || "N/A",
    healthIssues: teacher.medicalConditions || [],
    allergies: teacher.allergies || [],
    medications: teacher.currentMedications || [],
    temporaryPincode: teacher.temporaryPincode || "N/A",
    permanentPincode: teacher.permanentPincode || "N/A",
    status: teacher.hasLeftSchool ? "Inactive" : "Active",
    experienceYear: teacher.experienceYear || "0",
    joiningDate: teacher.joiningDate
      ? new Date(teacher.joiningDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A",
    qualification: teacher.qualification || [],
    emergencyContactName: teacher.emergencyContactName || "N/A",
    emergencyRelationship: teacher.emergencyRelationship || "N/A",
    emergencyContactPhone: teacher.emergencyContactPhone || "N/A",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  const formatArrayData = (value: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return "None";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  const InfoCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <DotIcon size={20} color="#007AFF" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.infoCard}>{children}</View>
    </View>
  );

  const InfoItem = ({
    icon,
    label,
    value,
    isArray = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | string[];
    isArray?: boolean;
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text
          style={[
            styles.infoValue,
            isArray && formatArrayData(value) !== "None" && styles.arrayValue,
          ]}
        >
          {isArray ? formatArrayData(value) : value}
        </Text>
      </View>
    </View>
  );

  const StatusBadge = ({ status }: { status: string }) => (
    <View
      style={[
        styles.statusBadge,
        status === "Active" ? styles.activeBadge : styles.inactiveBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          status === "Active" ? styles.activeText : styles.inactiveText,
        ]}
      >
        {status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {getInitials(profileData.name)}
              </Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.teacherId}>
            Teacher ID: {profileData.teacherId}
          </Text>
          <StatusBadge status={profileData.status} />
        </View>

        {/* Personal Information */}
        <InfoCard title="Personal Information">
          <InfoItem
            icon={<MailIcon size={18} color="#007AFF" />}
            label="Email"
            value={profileData.email}
          />
          <InfoItem
            icon={<PhoneIcon size={18} color="#007AFF" />}
            label="Phone"
            value={profileData.phone}
          />
          <InfoItem
            icon={<Calendar size={18} color="#007AFF" />}
            label="Date of Birth (AD)"
            value={profileData.dateOfBirth}
          />
          <InfoItem
            icon={<Calendar size={18} color="#007AFF" />}
            label="Date of Birth (BS)"
            value={profileData.dateOfBirthBS}
          />
        </InfoCard>

        {/* Address Information */}
        <InfoCard title="Address Information">
          <InfoItem
            icon={<MapPin size={18} color="#007AFF" />}
            label="Temporary Address"
            value={profileData.temporaryAddress}
          />
          <InfoItem
            icon={<MapPin size={18} color="#007AFF" />}
            label="Permanent Address"
            value={profileData.permanentAddress}
          />
          <InfoItem
            icon={<MapPin size={18} color="#007AFF" />}
            label="Temporary Pincode"
            value={profileData.temporaryPincode}
          />
          <InfoItem
            icon={<MapPin size={18} color="#007AFF" />}
            label="Permanent Pincode"
            value={profileData.permanentPincode}
          />
        </InfoCard>

        {/* Professional Information */}
        <InfoCard title="Professional Information">
          <InfoItem
            icon={<Clock size={18} color="#007AFF" />}
            label="Years of Experience"
            value={`${profileData.experienceYear} years`}
          />
          <InfoItem
            icon={<Calendar size={18} color="#007AFF" />}
            label="Joining Date"
            value={profileData.joiningDate}
          />
          <InfoItem
            icon={<Award size={18} color="#007AFF" />}
            label="Qualifications"
            value={profileData.qualification}
            isArray={true}
          />
        </InfoCard>

        {/* Health Information */}
        <InfoCard title="Health Information">
          <InfoItem
            icon={<Heart size={18} color="#007AFF" />}
            label="Blood Group"
            value={profileData.bloodGroup}
          />
          <InfoItem
            icon={<AlertCircle size={18} color="#007AFF" />}
            label="Medical Conditions"
            value={profileData.healthIssues}
            isArray={true}
          />
          <InfoItem
            icon={<AlertCircle size={18} color="#007AFF" />}
            label="Allergies"
            value={profileData.allergies}
            isArray={true}
          />
          <InfoItem
            icon={<Pill size={18} color="#007AFF" />}
            label="Current Medications"
            value={profileData.medications}
            isArray={true}
          />
        </InfoCard>

        {/* Emergency Contact */}
        <InfoCard title="Emergency Contact">
          <InfoItem
            icon={<UserCheck size={18} color="#007AFF" />}
            label="Contact Name"
            value={profileData.emergencyContactName}
          />
          <InfoItem
            icon={<User size={18} color="#007AFF" />}
            label="Relationship"
            value={profileData.emergencyRelationship}
          />
          <InfoItem
            icon={<Phone size={18} color="#007AFF" />}
            label="Phone Number"
            value={profileData.emergencyContactPhone}
          />
        </InfoCard>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInitials: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: "#fff",
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: "#1A1A1A",
    marginBottom: 4,
    textAlign: "center",
  },
  teacherId: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  activeBadge: {
    backgroundColor: "#E8F5E8",
  },
  inactiveBadge: {
    backgroundColor: "#FEE8E8",
  },
  statusText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  activeText: {
    color: "#2E7D32",
  },
  inactiveText: {
    color: "#D32F2F",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "#1A1A1A",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    paddingTop: 2,
  },
  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#1A1A1A",
    lineHeight: 22,
  },
  arrayValue: {
    fontFamily: "Inter_500Medium",
    color: "#007AFF",
  },
  bottomPadding: {
    height: 32,
  },
});
