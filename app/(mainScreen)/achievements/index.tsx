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
  Trophy,
  Star,
  Target,
  Award,
  Medal,
  Crown,
  Zap,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const achievements = [
  {
    id: "1",
    title: "Academic Excellence",
    description: "Maintained A grade in all subjects for 3 consecutive terms",
    icon: Crown,
    color: "#FF9500",
    points: 500,
    date: "March 15, 2024",
  },
  {
    id: "2",
    title: "Perfect Attendance",
    description: "Attended all classes for the entire semester",
    icon: Star,
    color: "#34C759",
    points: 300,
    date: "March 10, 2024",
  },
  {
    id: "3",
    title: "Quiz Master",
    description: "Scored 100% in 5 consecutive quizzes",
    icon: Zap,
    color: "#AF52DE",
    points: 400,
    date: "March 5, 2024",
  },
  {
    id: "4",
    title: "Science Champion",
    description: "Won first place in the annual science fair",
    icon: Trophy,
    color: "#FF2D55",
    points: 600,
    date: "February 28, 2024",
  },
];

export default function AchievementsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Medal size={24} color="#007AFF" />
            <Text style={styles.statNumber}>1,800</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FF9500" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Target size={24} color="#34C759" />
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={styles.achievementCard}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: achievement.color },
                ]}
              >
                <achievement.icon size={24} color="#fff" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>
                  {achievement.description}
                </Text>
                <View style={styles.achievementFooter}>
                  <View style={styles.pointsContainer}>
                    <Star size={16} color="#FF9500" />
                    <Text style={styles.pointsText}>
                      {achievement.points} pts
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{achievement.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Next Achievement</Text>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingContent}>
              <Award size={24} color="#007AFF" />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>Perfect Score Streak</Text>
                <Text style={styles.upcomingDesc}>
                  Score 100% in 3 more quizzes
                </Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "70%" }]} />
              </View>
              <Text style={styles.progressText}>70%</Text>
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
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 4,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginBottom: 8,
  },
  achievementFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#FF9500",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  upcomingContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 12,
  },
  upcomingCard: {
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
  upcomingContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  upcomingInfo: {
    marginLeft: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 4,
  },
  upcomingDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    width: 40,
  },
});
