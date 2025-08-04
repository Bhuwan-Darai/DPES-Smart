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

type SubjectCategory = "school" | "others";
type MaterialType = "video" | "pdf" | "quiz";

interface Chapter {
  id: string;
  title: string;
  materials: {
    type: MaterialType;
    title: string;
    duration?: string;
    questions?: number;
    id?: string;
  }[];
  progress: number;
}

interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  progress: number;
  chapters: Chapter[];
}

export default function StudyScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] =
    useState<SubjectCategory>("school");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Updated subjects data with material IDs
  const subjects: Subject[] = [
    {
      id: "1",
      name: "Mathematics",
      category: "school",
      progress: 75,
      chapters: [
        {
          id: "math-1",
          title: "Calculus",
          progress: 80,
          materials: [
            {
              type: "video",
              title: "Introduction to Derivatives",
              duration: "15:30",
              id: "derivatives",
            },
            {
              type: "video",
              title: "Integration Basics",
              duration: "20:45",
              id: "integration",
            },
            {
              type: "pdf",
              title: "Practice Problems Set 1",
              id: "practice-problems",
            },
            { type: "quiz", title: "Calculus Quiz 1", questions: 20 },
          ],
        },
        {
          id: "math-2",
          title: "Algebra",
          progress: 60,
          materials: [
            {
              type: "video",
              title: "Linear Equations",
              duration: "18:20",
              id: "linear-equations",
            },
            {
              type: "pdf",
              title: "Algebraic Expressions Worksheet",
              id: "algebra-worksheet",
            },
            { type: "quiz", title: "Algebra Practice Test", questions: 15 },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Physics",
      category: "school",
      progress: 65,
      chapters: [
        {
          id: "physics-1",
          title: "Mechanics",
          progress: 70,
          materials: [
            { type: "video", title: "Newton's Laws", duration: "25:15" },
            { type: "pdf", title: "Force and Motion Notes" },
            { type: "quiz", title: "Mechanics Assessment", questions: 25 },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Music Theory",
      category: "others",
      progress: 45,
      chapters: [
        {
          id: "music-1",
          title: "Basic Notation",
          progress: 50,
          materials: [
            { type: "video", title: "Reading Sheet Music", duration: "12:30" },
            { type: "pdf", title: "Music Symbols Guide" },
            { type: "quiz", title: "Notation Quiz", questions: 10 },
          ],
        },
      ],
    },
  ];

  const handleMaterialPress = (material: any) => {
    if (material.id) {
      router.push(`/study/material?id=${material.id}`);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) => subject.category === activeCategory
  );

  const renderMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case "video":
        return <Play size={20} color="#007AFF" />;
      case "pdf":
        return <FileCheck size={20} color="#FF9500" />;
      case "quiz":
        return <Trophy size={20} color="#34C759" />;
    }
  };

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
        {subjects
          .filter((subject) => subject.category === activeCategory)
          .map((subject) => (
            <View key={subject.id} style={styles.subjectCard}>
              <TouchableOpacity
                style={styles.subjectHeader}
                onPress={() =>
                  setExpandedSubject(
                    expandedSubject === subject.id ? null : subject.id
                  )
                }
              >
                <View style={styles.subjectInfo}>
                  <Book size={24} color="#007AFF" />
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${subject.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{subject.progress}%</Text>
                </View>
              </TouchableOpacity>

              {expandedSubject === subject.id && (
                <View style={styles.chaptersContainer}>
                  {subject.chapters.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterCard}>
                      <TouchableOpacity
                        style={styles.chapterHeader}
                        onPress={() =>
                          setExpandedChapter(
                            expandedChapter === chapter.id ? null : chapter.id
                          )
                        }
                      >
                        <View style={styles.chapterInfo}>
                          <FileText size={20} color="#666" />
                          <Text style={styles.chapterTitle}>
                            {chapter.title}
                          </Text>
                        </View>
                        <ChevronRight size={20} color="#666" />
                      </TouchableOpacity>

                      {expandedChapter === chapter.id && (
                        <View style={styles.materialsContainer}>
                          {chapter.materials.map((material, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.materialItem}
                              onPress={() => handleMaterialPress(material)}
                            >
                              {renderMaterialIcon(material.type)}
                              <View style={styles.materialInfo}>
                                <Text style={styles.materialTitle}>
                                  {material.title}
                                </Text>
                                {material.duration && (
                                  <Text style={styles.materialMeta}>
                                    Duration: {material.duration}
                                  </Text>
                                )}
                                {material.questions && (
                                  <Text style={styles.materialMeta}>
                                    {material.questions} Questions
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
});
