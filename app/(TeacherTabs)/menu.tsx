import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TopBar from "../../components/TopBar";
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  Settings,
  CircleHelp as HelpCircle,
  LogOut,
  GraduationCap,
} from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import TopBarTeacher from "@/components/TopBarTeacher";
import { GET_TEACHER_PROFILE } from "@/lib/hooks/graphql/TeacherQueries";
import { useQuery } from "@apollo/client";

const MenuScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();
  // const navigation = useNavigation();

  const menuItems = [
    {
      icon: User,
      title: "My Profile",
      subtitle: "View and edit your profile",
      route: "(teacherScreen)/profile" as const,
    },
    {
      icon: Calendar,
      title: "Student Attendance",
      subtitle: "Check your attendance record",
      route: "(teacherScreen)/attendance" as const,
    },
    {
      icon: Calendar,
      title: "Teacher Attendance",
      subtitle: "Check your attendance record",
      route: "(teacherScreen)/teacherAttendance" as const,
    },
    {
      icon: BookOpen,
      title: "Assignments",
      subtitle: "View pending assignments",
      route: "(teacherScreen)/assignment" as const,
    },
    {
      icon: GraduationCap,
      title: "Exam Routine",
      subtitle: "View your exam routine",
      route: "(teacherScreen)/examRoutine" as const,
    },
    {
      icon: Calendar,
      title: "Time Table",
      subtitle: "View your class schedule",
      route: "(teacherScreen)/timeTable" as const,
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences and notifications",
      route: "(teacherScreen)/settings" as const,
    },
  ];
  const { userDetails } = useAuth();
  const {
    data,
    loading,
    error,
    refetch: refetchStudent,
  } = useQuery(GET_TEACHER_PROFILE, {
    variables: {
      id: userDetails?.id,
    },
    fetchPolicy: "network-only",
    skip: !userDetails?.id,
  });

  const handleMenuItemPress = (route: string) => {
    // navigation.navigate(route as never);
    router.push(route as never);
  };

  const handleLogout = () => {
    console.log("Logout is being called");
    logout();
    console.log("Logout is done");

    router.push("/auth/login");
  };

  const teacherDetails = data?.getTeacherProfileDetails?.data;

  return (
    <View style={styles.container}>
      <TopBarTeacher />
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>
              {teacherDetails?.fullName}
            </Text>
          </View>
          <Text style={styles.profileName}>{teacherDetails?.fullName}</Text>
          <Text style={styles.profileDetails}>
            Email: {teacherDetails?.email}
          </Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <View style={styles.iconContainer}>
                <item.icon size={24} color="#007AFF" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <LogOut size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    // marginTop: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileInitials: {
    fontFamily: "Inter_900Black",
    fontSize: 32,
    color: "#fff",
  },
  profileName: {
    fontFamily: "Inter_900Black",
    fontSize: 24,
    color: "#000",
    marginBottom: 4,
  },
  profileDetails: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    // backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  logoutText: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 8,
  },
});

export default MenuScreen;
