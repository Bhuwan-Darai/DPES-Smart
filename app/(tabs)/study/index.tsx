import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import TopBar from "../../../components/TopBar";
import {
  Book,
  FileText,
  Video,
  Clock,
  Play,
  FileCheck,
  Trophy,
  ChevronRight,
} from "lucide-react-native";
import { useQuery } from "@apollo/client";
import { GET_SUBJECTS_QUERY } from "@/lib/hooks/graphql/queries";
import { useAuth } from "@/context/AuthContext";

type SubjectCategory = "school" | "others";

interface Subject {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  subjectType: "Compulsory" | "Optional";
  subjectVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function StudyScreen() {
  const router = useRouter();
  const { isAuthenticated, userDetails } = useAuth();
  const [activeCategory, setActiveCategory] =
    useState<SubjectCategory>("school");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // Don't render or execute queries if not authenticated
  if (!isAuthenticated || !userDetails) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text style={styles.authMessage}>
            Please log in to view study materials
          </Text>
        </View>
      </View>
    );
  }

  // queries - only execute when authenticated
  const { data, loading, error } = useQuery(GET_SUBJECTS_QUERY, {
    skip: !isAuthenticated, // Skip query if not authenticated
  });

  console.log("subjects", JSON.stringify(data?.getStudentSubjects, null, 2));

  // Map API subjects to the subjects array
  const subjects: Subject[] = React.useMemo(() => {
    if (!data?.getStudentSubjects?.subjects) {
      return [];
    }

    return data.getStudentSubjects.subjects.map(
      (apiSubject: any, index: number) => ({
        id: apiSubject.subjectId || apiSubject.id || index.toString(),
        subjectId: apiSubject.subjectId || apiSubject.id || index.toString(),
        subjectName: apiSubject.subjectName,
        subjectCode: apiSubject.subjectCode,
        subjectType: apiSubject.subjectType,
        subjectVisible: apiSubject.subjectVisible,
        createdAt: apiSubject.createdAt,
        updatedAt: apiSubject.updatedAt,
      })
    );
  }, [data?.getStudentSubjects?.subjects]);

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeCategory === "school" && styles.activeTab]}
          onPress={() => setActiveCategory("school")}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === "school" && styles.activeTabText,
            ]}
          >
            School
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeCategory === "others" && styles.activeTab]}
          onPress={() => setActiveCategory("others")}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === "others" && styles.activeTabText,
            ]}
          >
            Others
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading subjects...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error loading subjects: {error.message}
            </Text>
          </View>
        )}

        {!loading && !error && subjects.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No subjects available</Text>
          </View>
        )}

        {activeCategory === "school" &&
          !loading &&
          !error &&
          subjects.map((subject) => (
            <View key={subject.id} style={styles.subjectCard}>
              <TouchableOpacity
                style={styles.subjectHeader}
                onPress={() => {
                  console.log(
                    "Navigating to subject:",
                    subject.subjectId,
                    "Subject:",
                    subject
                  );
                  router.push({
                    pathname: "/study/[id]",
                    params: {
                      id: subject.subjectId,
                    },
                  });
                }}
              >
                <View style={styles.subjectInfo}>
                  <Book size={24} color="#007AFF" />
                  <Text style={styles.subjectName}>{subject.subjectName}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${subject.subjectVisible ? 100 : 0}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {subject.subjectVisible ? "Visible" : "Hidden"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}

        {activeCategory === "others" && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Other content coming soon...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectHeader: {
    padding: 16,
    flexDirection: "column",
    gap: 12,
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subjectName: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#000",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
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
    width: 40,
  },
  chaptersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chapterCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  chapterHeader: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chapterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chapterTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#000",
  },
  materialsContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  materialMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  emptyContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  authMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
});
