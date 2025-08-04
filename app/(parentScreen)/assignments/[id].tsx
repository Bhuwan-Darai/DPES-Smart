import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ASSIGNMENTS_FOR_STUDENT,
  GET_COMPLETED_ASSIGNMENTS_FOR_STUDENT,
  SUBMIT_ASSIGNMENT,
} from "@/lib/hooks/graphql/queries";
import { getNepalLocalDate } from "@/util/getNepalDate";
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "@/lib/constants";
import { GET_ASSIGNMENTS_FOR_PARENT } from "@/lib/hooks/graphql/ParentQueries";

interface Assignment {
  assignmentId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  passMarks: number;
  isActive: boolean;
  fullMarks: number;
  assignmentFiles: {
    fileId: string;
    assignmentId: string;
    fileName: string;
    fileUrl: string;
  }[];
  submissions: {
    submissionId: string;
    assignmentId: string;
    studentId: string;
    submissionDate: string;
    marks: number;
    status: string;
    files: {
      fileId: string;
      submissionId: string;
      fileUrl: string;
    }[];
  }[];
}

interface Submission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  marks: number;
  status: string;
}

export default function AssignmentsScreen() {
  // get the student id from the url
  const { id } = useLocalSearchParams();
  console.log(id, "id");
  // states
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any[]>([]);
  const [filePath, setFilePath] = useState<string[]>([]);
  const router = useRouter();

  /*----------------- query hooks -----------------*/
  const { data, loading, error, refetch } = useQuery(
    GET_ASSIGNMENTS_FOR_PARENT,
    {
      variables: {
        studentId: id as string,
      },
    }
  );

  useEffect(() => {
    if (data?.getAssignmentsForParent) {
      const allAssignments = data.getAssignmentsForParent;
      setAssignments(allAssignments);

      // Filter completed assignments (those with submissions and status "submitted")
      const completed = allAssignments.filter(
        (assignment: Assignment) =>
          assignment.submissions &&
          assignment.submissions.length > 0 &&
          assignment.submissions.some(
            (sub: Submission) => sub.status === "submitted"
          )
      );
      setCompletedAssignments(completed);
    }
  }, [data?.getAssignmentsForParent]);

  console.log("assignments from parent", JSON.stringify(assignments, null, 2));

  const nowInNepal = getNepalLocalDate(new Date().toISOString());

  // Filter pending assignments (those without submissions or not submitted)
  const pendingAssignments = assignments.filter((assignment: any) => {
    const hasNoSubmissions =
      !assignment.submissions || assignment.submissions.length === 0;
    const hasNoSubmittedStatus =
      assignment.submissions &&
      !assignment.submissions.some((sub: any) => sub.status === "submitted");
    return hasNoSubmissions || hasNoSubmittedStatus;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FileText size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{pendingAssignments.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={24} color="#34C759" />
            <Text style={styles.statNumber}>{completedAssignments.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Assignments</Text>
          {pendingAssignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.assignmentId}
              style={styles.assignmentCard}
              onPress={() => {
                router.push({
                  pathname: "/assignments/assignmentDetails/[id]",
                  params: {
                    id: assignment.assignmentId,
                    assignment: JSON.stringify(assignment),
                  },
                });
              }}
            >
              <View style={styles.assignmentHeader}>
                <View style={styles.titleContainer}>
                  <FileText size={20} color="#007AFF" />
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>
                    {assignment.instructions.slice(0, 10)}...
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectText}>{assignment.description}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#8E8E93" />
                  <Text style={styles.detailText}>{assignment.dueDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Assignments</Text>
          {completedAssignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.assignmentId}
              style={styles.assignmentCard}
              onPress={() => {
                router.push({
                  pathname: "/assignments/assignmentDetails/[id]",
                  params: {
                    id: assignment.assignmentId,
                    assignment: JSON.stringify(assignment),
                  },
                });
              }}
            >
              <View style={styles.assignmentHeader}>
                <View style={styles.titleContainer}>
                  <FileText size={20} color="#007AFF" />
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>
                    {assignment.instructions.slice(0, 10)}...
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectText}>{assignment.description}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#8E8E93" />
                  <Text style={styles.detailText}>{assignment.dueDate}</Text>
                </View>
                {assignment.submissions &&
                  assignment.submissions.length > 0 && (
                    <View style={styles.detailItem}>
                      <CheckCircle size={16} color="#34C759" />
                      <Text style={styles.detailText}>
                        Submissions: {assignment.submissions.length}
                      </Text>
                    </View>
                  )}
              </View>

              {assignment.submissions && assignment.submissions.length > 0 && (
                <View style={styles.submissionDetails}>
                  <Text style={styles.submissionTitle}>Latest Submission:</Text>
                  <Text style={styles.submissionDate}>
                    Date:{" "}
                    {new Date(
                      assignment.submissions[0].submissionDate
                    ).toLocaleDateString()}
                  </Text>
                  {assignment.submissions[0].files &&
                    assignment.submissions[0].files.length > 0 && (
                      <Text style={styles.submissionFiles}>
                        Files: {assignment.submissions[0].files.length}
                      </Text>
                    )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginTop: 40,
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
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 16,
  },
  assignmentCard: {
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
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignmentTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginLeft: 8,
  },
  typeBadge: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#8E8E93",
  },
  subjectText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#007AFF",
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  submissionDetails: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
  },
  submissionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  submissionFiles: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 2,
  },
});
