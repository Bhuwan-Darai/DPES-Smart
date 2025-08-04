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
import { Book } from "lucide-react-native";
import { useQuery } from "@apollo/client";
import { GET_TEACHER_CLASSROOM_QUERY } from "@/lib/hooks/graphql/TeacherQueries";
import TopBarTeacher from "@/components/TopBarTeacher";

type SubjectCategory = "school" | "others";

interface TeacherClassSectionSubject {
  subjectId: string;
  subjectName: string;
}

interface TeacherClassSection {
  sectionId: string;
  sectionName: string;
  subjects: TeacherClassSectionSubject[];
}

interface TeacherClass {
  classId: string;
  className: string;
  sections: TeacherClassSection[];
  subjects: TeacherClassSectionSubject[];
}

interface TeacherClassDetails {
  getTeacherClassSubjects: {
    message: string;
    success: boolean;
    data: TeacherClass[];
  };
}

export default function StudyScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] =
    useState<SubjectCategory>("school");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // get the teacher's classroom, subjects and sections
  const { data, loading, error } = useQuery<TeacherClassDetails>(
    GET_TEACHER_CLASSROOM_QUERY
  );

  // console.log("teacherClassDetails", JSON.stringify(data, null, 2));
  const toggleClass = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
    setExpandedSection(null); // Reset section when class is toggled
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <View style={styles.container}>
      <TopBarTeacher/>
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
            <Text style={styles.loadingText}>Loading classes...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
          </View>
        )}

        {activeCategory === "school" &&
          !loading &&
          !error &&
          data?.getTeacherClassSubjects?.data?.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No classes available</Text>
            </View>
          )}

        {activeCategory === "school" &&
          !loading &&
          !error &&
          data?.getTeacherClassSubjects?.data.map((classItem) => (
            <View key={classItem.classId} style={styles.subjectCard}>
              <TouchableOpacity
                style={styles.subjectHeader}
                onPress={() => toggleClass(classItem.classId)}
              >
                <View style={styles.subjectInfo}>
                  <Book size={24} color="#007AFF" />
                  <Text style={styles.subjectName}>{classItem.className}</Text>
                </View>
              </TouchableOpacity>

              {expandedClass === classItem.classId && (
                <View style={styles.chaptersContainer}>
                  {classItem.sections.map((section) => (
                    <View key={section.sectionId} style={styles.chapterCard}>
                      <TouchableOpacity
                        style={styles.chapterHeader}
                        onPress={() => toggleSection(section.sectionId)}
                      >
                        <View style={styles.chapterInfo}>
                          <Text style={styles.chapterTitle}>
                            {section.sectionName}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {expandedSection === section.sectionId && (
                        <View style={styles.materialsContainer}>
                          {section.subjects.map((subject) => (
                            <TouchableOpacity
                              key={subject.subjectId}
                              style={styles.materialItem}
                              onPress={() => {
                                router.push({
                                  pathname: "/study/[id]",
                                  params: { id: subject.subjectId, classId: classItem.classId },
                                });
                              }}
                            >
                              <View style={styles.materialInfo}>
                                <Text style={styles.materialTitle}>
                                  {subject.subjectName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                          {section.subjects.length === 0 && (
                            <View style={styles.emptyContainer}>
                              <Text style={styles.emptyText}>
                                No subjects for this section
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
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

// Styles remain unchanged (as provided in the original question)
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
    marginTop:4
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
});
