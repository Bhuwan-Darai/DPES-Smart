import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

import {
  Book,
  Brain,
  Trophy,
  Clock,
  Star,
  Users,
  GraduationCap,
  Target,
  Calendar,
  FileText,
  Bell,
  Award,
  BarChart2,
  Settings,
  HelpCircle,
  BookOpen,
  ClipboardList,
  Code,
} from "lucide-react-native";
// import { useNavigation } from '@react-navigation/native';
import CustomCarousel from "@/components/CustomCarousel";
import { useQuery } from "@apollo/client";
import {
  GET_ALL_NEWSFEED_CATEGORIES,
  GET_ALL_STUDENTS_WITH_DIVISION,
  GET_ROOT_TYPENAME,
} from "@/lib/hooks/graphql/queries";
import ErrorScreen from "@/components/ui/ErrorScreen";
import TopBarParents from "@/components/TopBarParents";

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}
export default function HomeScreen() {
  const router = useRouter();
  // const navigation = useNavigation();
  const carouselRef = useRef(null);
  const { width: screenWidth } = Dimensions.get("window");
  const [show, setShow] = useState(false);
  const [expandedNoticeIndex, setExpandedNoticeIndex] = useState<number | null>(
    null
  );
  const menuItems = [
    {
      icon: BookOpen,
      label: "Exam Routine",
      route: "(parentScreen)/examRoutine",
    },
    { icon: Calendar, label: "Homework", route: "(parentScreen)/homework" },
    {
      icon: ClipboardList,
      label: "Assignments",
      route: "(parentScreen)/assignments",
    },
    {
      icon: FileText,
      label: "Vaccation Home Work",
      route: "(parentScreen)/vaccationHomeWork",
    },
    {
      icon: ClipboardList,
      label: "Student Leave",
      route: "(parentScreen)/leaveApply",
    },
    {
      icon: BarChart2,
      label: "Result",
      route: "(parentScreen)/result",
    },
    // { icon: Trophy, label: "Achievements", route: "(mainScreen)/achievements" },
    // { icon: Bell, label: "Notifications", route: "(mainScreen)/notifications" },
    // { icon: Settings, label: "Settings", route: "(mainScreen)/settings" },
    // { icon: HelpCircle, label: "Help", route: "(mainScreen)/help" },
    // { icon: Brain, label: "IOT", route: "(mainScreen)/iot" },
    // { icon: Code, label: "Programming", route: "(mainScreen)/programming" },
    // { icon: Brain, label: "AI", route: "(mainScreen)/ai" },
  ];

  const notices = [
    {
      title: "Annual Sports Day",
      time: "2 hours ago",
      description:
        "Registration for annual sports day is now open. Last date to register is 25th March. Join various events and win exciting prizes!",
      priority: "high",
    },
    {
      title: "Parent-Teacher Meeting",
      time: "5 hours ago",
      description:
        "Schedule for next week's parent-teacher meeting has been published. Please check your email for the detailed schedule.",
      priority: "medium",
    },
    {
      title: "Library Book Return",
      time: "1 day ago",
      description:
        "All students are requested to return library books before the end of this month. Late returns will incur a penalty.",
      priority: "low",
    },
  ];

  const handleMenuItemPress = (route: string) => {
    console.log("Navigating to:", route);
    // router.replace(route as any);
    router.push(route as never);
  };

  const handleReadMore = (index: number) => {
    setExpandedNoticeIndex(expandedNoticeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <TopBarParents />
      <ScrollView style={styles.content}>
        <View style={styles.chipContainer}>
          <TouchableOpacity
            style={[styles.chip, styles.activeChip]}
            onPress={() => router.push("(mainScreen)/todaynews" as never)}
          >
            <Text style={styles.chipText}>Today News</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.chip, styles.activeChip]}
            onPress={() => router.push("(mainScreen)/todayquiz" as never)}
          >
            <Text style={styles.chipText}>Today Quiz</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.chip, styles.activeChip]}
            onPress={() => router.push("(parentScreen)/calendar" as never)}
          >
            <Text style={styles.chipText}>Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.route)}
              >
                <item.icon size={24} color="#007AFF" />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Learning</Text>
          <View style={styles.learningCard}>
            <View style={styles.learningHeader}>
              <Brain size={24} color="#007AFF" />
              <Text style={styles.learningTitle}>Advanced Calculus</Text>
            </View>
            <Text style={styles.learningTime}>10:30 AM - 12:00 PM</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "60%" }]} />
            </View>
            <Text style={styles.progressText}>60% Completed</Text>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Quiz</Text>
          <View style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Book size={24} color="#FF9500" />
              <Text style={styles.quizTitle}>Physics Quiz</Text>
            </View>
            <Text style={styles.quizInfo}>20 Questions • 30 Minutes</Text>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {["Mathematics", "Physics", "English", "Computer Science"].map(
            (subject, index) => (
              <View key={index} style={styles.scheduleCard}>
                <Text style={styles.subjectName}>{subject}</Text>
                <Text style={styles.timing}>{`${8 + index}:00 AM - ${
                  9 + index
                }:00 AM`}</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notices</Text>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Important Announcement</Text>
            <Text style={styles.noticeText}>
              Please complete your course registration by Friday.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Learning</Text>
          <View style={styles.learningCard}>
            <Text style={styles.learningTitle}>Mathematics 101</Text>
            <Text style={styles.learningTime}>Chapter 3: Linear Equations</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notices</Text>
          <View style={styles.noticeCard}>
            {notices.map((notice, index) => (
              <View key={notice.title + "-" + index} style={styles.noticeItem}>
                <View
                  style={[
                    styles.noticePriorityIndicator,
                    notice.priority === "high"
                      ? styles.priorityHigh
                      : notice.priority === "medium"
                      ? styles.priorityMedium
                      : styles.priorityLow,
                  ]}
                />
                <View style={styles.noticeContent}>
                  <View style={styles.noticeHeader}>
                    <Text style={styles.noticeTitle}>{notice.title}</Text>
                    <Text style={styles.noticeTime}>{notice.time}</Text>
                  </View>
                  <View style={styles.noticeFooter}>
                    <TouchableOpacity
                      style={styles.noticeButton}
                      onPress={() => handleReadMore(index)}
                    >
                      <Text style={styles.noticeButtonText}>
                        {expandedNoticeIndex === index ? "Hide" : "Read More"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {expandedNoticeIndex === index && (
                    <Text style={styles.noticeDescription}>
                      {notice.description}
                    </Text>
                  )}
                </View>
              </View>
            ))}
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
    padding: 16,
    // marginBottom: 100,
  },

  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  welcomeImage: {
    width: "100%",
    height: 150,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
  statItem: {
    width: "33%",
    alignItems: "center",
    padding: 8,
  },
  statNumber: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#000",
    marginTop: 4,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  viewAllText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#007AFF",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    width: "31%",
    alignItems: "center",
    marginBottom: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemLabel: {
    fontFamily: "Inter_900Black",
    fontSize: 12,
    color: "#1A1A1A",
    textAlign: "center",
  },
  noticeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noticeTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  noticeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#8E8E93",
  },
  noticeItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  noticePriorityIndicator: {
    width: 6,
    backgroundColor: "#007AFF",
  },
  priorityHigh: {
    backgroundColor: "#FF3B30",
  },
  priorityMedium: {
    backgroundColor: "#FF9500",
  },
  priorityLow: {
    backgroundColor: "#34C759",
  },
  noticeContent: {
    flex: 1,
    padding: 16,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noticeTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  noticeDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  noticeFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  noticeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  noticeButtonText: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#007AFF",
  },
  learningCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  learningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  learningTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#000",
    marginLeft: 12,
  },
  learningTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  progressText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  quizCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quizTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#000",
    marginLeft: 12,
  },
  quizInfo: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#fff",
  },
  scheduleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  timing: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  carouselContainer: {
    width: "100%",
    height: 200,
  },
  carouselItem: {
    width: "100%",
    height: 200,
    position: "relative",
  },

  carouselOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  activeChip: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
