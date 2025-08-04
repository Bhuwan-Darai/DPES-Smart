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
} from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

export default function MenuScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  // const navigation = useNavigation();

  const menuItems = [
    {
      icon: User,
      title: "My Profile",
      subtitle: "View and edit your profile",
      route: "(mainScreen)/profile" as const,
    },
    {
      icon: Calendar,
      title: "Attendance",
      subtitle: "Check your attendance record",
      route: "(mainScreen)/attendance" as const,
    },
    {
      icon: BookOpen,
      title: "Assignments",
      subtitle: "View pending assignments",
      route: "(mainScreen)/assignments" as const,
    },
    {
      icon: Clock,
      title: "Time Table",
      subtitle: "View your class schedule",
      route: "(mainScreen)/timetable" as const,
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences and notifications",
      route: "(mainScreen)/settings" as const,
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Get assistance and FAQs",
      route: "(mainScreen)/help" as const,
    },
    {
      icon: BookOpen,
      title: "Saved Content",
      subtitle: "View your saved content",
      route: "(mainScreen)/menu" as const,
    },
  ];

  const handleMenuItemPress = (route: string) => {
    // navigation.navigate(route as never);
    router.push(route as never);
  };

  const handleLogout =  () => {
    console.log("Logout is being called");
     logout();
    console.log("Logout is done");

    router.push("/auth/login");
  };


  return (
    <View style={styles.container}>
      <TopBar  />
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>JD</Text>
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileDetails}>Student ID: 2023001</Text>
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

        <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
          <LogOut size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
