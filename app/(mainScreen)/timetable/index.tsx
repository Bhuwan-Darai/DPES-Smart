import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
  Animated,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Coffee,
  X,
  User,
  BookOpen,
  GraduationCap,
  Bell,
  Sparkles,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_CLASS_ROUTINE } from "@/lib/hooks/graphql/queries";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Subject = {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  sectionId: string;
};

type Period = {
  periodId: string;
  periodName: string;
  startTime: string;
  endTime: string;
  subjects: Subject[];
};

type BreakTime = {
  breakTimeId: string;
  breakName: string;
  startTime: string;
  endTime: string;
  breakTime: string;
};

type Lesson = {
  id: string;
  type: "class" | "break";
  subject?: string;
  teacher?: string;
  period?: string;
  breakName?: string;
  startTime: string;
  endTime: string;
  subjects?: Subject[];
};

export default function TimetableScreen() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_CLASS_ROUTINE);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  console.log("data", JSON.stringify(data?.getClassRoutine, null, 2));

  // Animated loading spinner
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Subject color themes
  const getSubjectColor = (subject: string): [string, string] => {
    const colors: Record<string, [string, string]> = {
      Math: ["#667eea", "#764ba2"],
      Science: ["#f093fb", "#f5576c"],
      English: ["#4facfe", "#00f2fe"],
      History: ["#43e97b", "#38f9d7"],
      Art: ["#fa709a", "#fee140"],
      Nepali: ["#ffecd2", "#fcb69f"],
      Samajik: ["#a8edea", "#fed6e3"],
      "Comp. Sci": ["#667eea", "#764ba2"],
      Account: ["#ffecd2", "#fcb69f"],
      Default: ["#a8edea", "#fed6e3"],
    };

    const key =
      Object.keys(colors).find((k) =>
        subject?.toLowerCase().includes(k.toLowerCase())
      ) || "Default";

    return colors[key as keyof typeof colors];
  };

  // Helper to get all lessons from API data
  const getAllLessons = (): Lesson[] => {
    if (!data?.getClassRoutine) return [];

    const lessons: Lesson[] = [];

    // Add periods (classes)
    data.getClassRoutine.periods.forEach((period: Period) => {
      period.subjects.forEach((subject: Subject) => {
        lessons.push({
          id: `${period.periodId}-${subject.subjectId}`,
          type: "class",
          subject: subject.subjectName,
          teacher: subject.teacherName,
          period: period.periodName,
          startTime: period.startTime,
          endTime: period.endTime,
          subjects: period.subjects, // for showing multiple subjects in modal
        });
      });
    });

    // Add breaks
    if (
      data.getClassRoutine.breakTime &&
      Array.isArray(data.getClassRoutine.breakTime)
    ) {
      data.getClassRoutine.breakTime.forEach((breakTime: BreakTime) => {
        lessons.push({
          id: breakTime.breakTimeId,
          type: "break",
          breakName: breakTime.breakName,
          startTime: breakTime.startTime,
          endTime: breakTime.endTime,
        });
      });
    }

    // Sort by start time
    return lessons.sort((a, b) => {
      const timeA = new Date(`2000-01-01 ${a.startTime}`);
      const timeB = new Date(`2000-01-01 ${b.startTime}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  const handlePeriodPress = (lesson: Lesson) => {
    if (lesson.type === "class") {
      setSelectedLesson(lesson);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLesson(null);
  };

  const formatTime = (time: string) => {
    return time.replace(":", "");
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const isCurrentLesson = (lesson: Lesson) => {
    const now = getCurrentTime();
    return now >= lesson.startTime && now <= lesson.endTime;
  };

  const LessonCard = ({ lesson, index }: { lesson: Lesson; index: number }) => {
    const isBreak = lesson.type === "break";
    const isCurrent = isCurrentLesson(lesson);
    const colors = isBreak
      ? (["#ff9a9e", "#fecfef"] as [string, string])
      : getSubjectColor(lesson.subject || "");

    return (
      <TouchableOpacity
        style={[styles.lessonCard, isCurrent && styles.currentLessonCard]}
        onPress={() => handlePeriodPress(lesson)}
        disabled={isBreak}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.lessonHeader}>
              <View style={styles.iconContainer}>
                {isBreak ? (
                  <Coffee size={24} color="#fff" />
                ) : (
                  <BookOpen size={24} color="#fff" />
                )}
              </View>

              <View style={styles.lessonTitleContainer}>
                <Text style={styles.lessonTitle}>
                  {isBreak ? lesson.breakName : lesson.subject}
                </Text>
                {lesson.type === "class" && lesson.period && (
                  <Text style={styles.periodText}>{lesson.period}</Text>
                )}
              </View>

              {isCurrent && (
                <View style={styles.liveIndicator}>
                  <Sparkles size={12} color="#fff" />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>

            <View style={styles.lessonDetails}>
              <View style={styles.detailRow}>
                <Clock size={18} color="rgba(255,255,255,0.9)" />
                <Text style={styles.detailText}>
                  {lesson.startTime} - {lesson.endTime}
                </Text>
              </View>

              {lesson.type === "class" && lesson.teacher && (
                <View style={styles.detailRow}>
                  <User size={18} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.detailText}>{lesson.teacher}</Text>
                </View>
              )}
            </View>
          </View>

          {!isBreak && (
            <View style={styles.cardAccent}>
              <GraduationCap size={20} color="rgba(255,255,255,0.6)" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.routineHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.routineTitle}>
              {data?.getClassRoutine?.routineName || "Today's Schedule"}
            </Text>
            <Text style={styles.routineSubtitle}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <BookOpen size={20} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.statNumber}>
                {getAllLessons().filter((l) => l.type === "class").length}
              </Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Coffee size={20} color="rgba(255,255,255,0.9)" />
              </View>
              <Text style={styles.statNumber}>
                {getAllLessons().filter((l) => l.type === "break").length}
              </Text>
              <Text style={styles.statLabel}>Breaks</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flex: 1, paddingTop: 20 }}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.scheduleContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Animated.View
                  style={[
                    styles.loadingSpinner,
                    { transform: [{ rotate: spin }] },
                  ]}
                />
                <Text style={styles.loadingText}>Loading your schedule...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <View style={styles.errorIcon}>
                  <X size={48} color="#ff6b6b" />
                </View>
                <Text style={styles.errorText}>Unable to load schedule</Text>
                <Text style={styles.errorSubText}>{error.message}</Text>
              </View>
            ) : getAllLessons().length === 0 ? (
              <View style={styles.emptyContainer}>
                <Calendar size={64} color="#ddd" />
                <Text style={styles.emptyText}>No classes scheduled today</Text>
                <Text style={styles.emptySubText}>Enjoy your free day!</Text>
              </View>
            ) : (
              getAllLessons().map((lesson: Lesson, index: number) => (
                <LessonCard key={lesson.id} lesson={lesson} index={index} />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Enhanced Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLesson && (
              <>
                <LinearGradient
                  colors={getSubjectColor(selectedLesson.subject || "")}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalHeader}
                >
                  <View style={styles.modalHeaderContent}>
                    <View style={styles.modalTitleContainer}>
                      <BookOpen size={28} color="#fff" />
                      <Text style={styles.modalTitle}>
                        {selectedLesson.subject}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}
                    >
                      <X size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                <View style={styles.modalBody}>
                  <View style={styles.subjectInfo}>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoCard}>
                        <User size={24} color="#667eea" />
                        <Text style={styles.infoLabel}>Teacher</Text>
                        <Text style={styles.infoValue}>
                          {selectedLesson.teacher}
                        </Text>
                      </View>

                      <View style={styles.infoCard}>
                        <Calendar size={24} color="#667eea" />
                        <Text style={styles.infoLabel}>Period</Text>
                        <Text style={styles.infoValue}>
                          {selectedLesson.period}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeCard}>
                      <Clock size={28} color="#667eea" />
                      <View style={styles.timeInfo}>
                        <Text style={styles.timeLabel}>Class Duration</Text>
                        <Text style={styles.timeValue}>
                          {selectedLesson.startTime} - {selectedLesson.endTime}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedLesson.subjects &&
                    selectedLesson.subjects.length > 1 && (
                      <View style={styles.additionalSubjects}>
                        <Text style={styles.additionalSubjectsTitle}>
                          📚 All Subjects This Period
                        </Text>
                        {selectedLesson.subjects.map((subject, index) => (
                          <View
                            key={index}
                            style={styles.additionalSubjectItem}
                          >
                            <View style={styles.subjectDot} />
                            <View style={styles.subjectDetails}>
                              <Text style={styles.additionalSubjectName}>
                                {subject.subjectName}
                              </Text>
                              <Text style={styles.additionalSubjectTeacher}>
                                👨‍🏫 {subject.teacherName}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: 50,
  },
  routineHeader: {
    padding: 24,
    paddingBottom: 32,
  },
  headerContent: {
    marginBottom: 20,
  },
  routineTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  routineSubtitle: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
  },
  headerStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(10px)",
    marginBottom: 10,
    paddingBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scheduleContainer: {
    padding: 20,
    marginTop: -20,
  },
  lessonCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  currentLessonCard: {
    elevation: 16,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    transform: [{ scale: 1.02 }],
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardGradient: {
    padding: 20,
    minHeight: 120,
    position: "relative",
  },
  cardContent: {
    flex: 1,
  },
  cardAccent: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lessonTitleContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  periodText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  liveText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    marginLeft: 6,
  },
  lessonDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
    marginLeft: 12,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#667eea",
    marginBottom: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: "#667eea",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#ff6b6b",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#8e8e93",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    color: "#8e8e93",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#c4c4c6",
    marginTop: 8,
  },
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: width * 0.9,
    maxHeight: height * 0.8,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    padding: 24,
    paddingBottom: 20,
  },
  modalHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginLeft: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 24,
  },
  subjectInfo: {
    gap: 20,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#64748b",
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#1e293b",
    marginTop: 4,
    textAlign: "center",
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d9ff",
  },
  timeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#667eea",
  },
  timeValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#4f46e5",
    marginTop: 4,
  },
  additionalSubjects: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  additionalSubjectsTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#1e293b",
    marginBottom: 16,
  },
  additionalSubjectItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
  },
  subjectDot: {
    width: 8,
    height: 8,
    backgroundColor: "#667eea",
    borderRadius: 4,
    marginRight: 16,
  },
  subjectDetails: {
    flex: 1,
  },
  additionalSubjectName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#1e293b",
  },
  additionalSubjectTeacher: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#64748b",
    marginTop: 4,
  },
});
