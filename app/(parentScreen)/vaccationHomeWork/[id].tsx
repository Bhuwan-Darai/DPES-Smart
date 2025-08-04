import { GET_STUDENT_VACATION_HOMEWORK_FOR_PARENT } from "@/lib/hooks/graphql/ParentQueries";
import { useQuery } from "@apollo/client";
import { formatDate } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Award,
  Calendar,
  Clock,
  Download,
  FileText,
  Upload,
} from "lucide-react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export interface File {
  fileId: string;
  fileName: string;
  fileUrl: string;
}

export interface Submission {
  submissionId: string;
  submissionDate: string;
  marks: string;
  remarks: string;
  status: string;
  files: File[];
}

export interface Homework {
  vacationId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  points: number;
  files: File[];
  submissions: Submission[];
  subjectName: string;
}

export default function VaccationHomeWorkDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Vacation Homework
  const {
    data: vacationData,
    loading: vacationLoading,
    error: vacationError,
    refetch: vacationRefetch,
  } = useQuery(GET_STUDENT_VACATION_HOMEWORK_FOR_PARENT, {
    variables: {
      studentId: id as string,
    },
  });

  const formatDate = (
    dateStringOrTimestamp: string | number | Date
  ): string => {
    let date: Date;

    if (dateStringOrTimestamp instanceof Date) {
      date = dateStringOrTimestamp;
    } else if (typeof dateStringOrTimestamp === "string") {
      date = new Date(dateStringOrTimestamp);
      if (isNaN(date.getTime())) {
        // Try converting string to number (timestamp)
        const timestamp = parseInt(dateStringOrTimestamp, 10);
        date = new Date(timestamp);
      }
    } else if (typeof dateStringOrTimestamp === "number") {
      date = new Date(dateStringOrTimestamp);
    } else {
      console.error("Invalid date input:", dateStringOrTimestamp);
      return "Invalid Date";
    }

    if (isNaN(date.getTime())) {
      console.error("Failed to parse date:", dateStringOrTimestamp);
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "#FF3B30"; // Overdue - Red
    if (diffDays <= 3) return "#FF9500"; // Due soon - Orange
    return "#34C759"; // On time - Green
  };

  const homeworkData: Homework[] =
    vacationData?.getStudentVacationHomeworkForParent?.data || [];

  const getStatusText = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays <= 3) return `Due in ${diffDays} days`;
    return `Due in ${diffDays} days`;
  };

  console.log(JSON.stringify(homeworkData, null, 2), "homeworkData");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.homeworkList}>
        {homeworkData.map((homework: any, index: number) => {
          const isSubmitted =
            homework.submissions && homework.submissions.length > 0;

          return (
            <TouchableOpacity
              key={homework.vacationId || index}
              style={styles.homeworkCard}
              onPress={() => {
                router.push({
                  pathname:
                    "/(parentScreen)/vaccationHomeWork/homeWorkDetail/[id]",
                  params: {
                    id: homework.vacationId,
                    homework: JSON.stringify(homework),
                  },
                });
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <FileText size={20} color="#007AFF" />
                  <Text style={styles.homeworkTitle} numberOfLines={2}>
                    {homework.subjectName}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(homework.endDate) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(homework.endDate)}
                  </Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {homework.title}
              </Text>
              <Text style={styles.description} numberOfLines={3}>
                {homework.description}
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#8E8E93" />
                  <Text style={styles.detailText}>
                    Start: {formatDate(homework.startDate)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color="#8E8E93" />
                  <Text style={styles.detailText}>
                    End: {formatDate(homework.endDate)}
                  </Text>
                </View>
                {homework.points > 0 && (
                  <View style={styles.detailItem}>
                    <Award size={16} color="#FF9500" />
                    <Text style={styles.detailText}>
                      {homework.points} points
                    </Text>
                  </View>
                )}
              </View>

              {homework.files && homework.files.length > 0 && (
                <View style={styles.filesContainer}>
                  <Text style={styles.filesTitle}>Attached Files:</Text>
                  {homework.files.map((file: any, fileIndex: number) => (
                    <View
                      key={file.fileId || fileIndex}
                      style={styles.fileItem}
                    >
                      <Download size={16} color="#007AFF" />
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.fileName}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {isSubmitted && (
                <View style={styles.submissionContainer}>
                  <Text style={styles.submissionTitle}>Your Submission:</Text>
                  {homework.submissions.map(
                    (submission: any, subIndex: number) => (
                      <View
                        key={submission.submissionId || subIndex}
                        style={styles.submissionItem}
                      >
                        <Text style={styles.submissionDate}>
                          Submitted: {formatDate(submission.submissionDate)}
                        </Text>
                        {submission.marks && (
                          <Text style={styles.submissionMarks}>
                            Marks: {submission.marks}
                          </Text>
                        )}
                        {submission.status && (
                          <Text style={styles.submissionStatus}>
                            Status: {submission.status}
                          </Text>
                        )}
                      </View>
                    )
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeworkList: {
    padding: 16,
  },
  homeworkCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  homeworkTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginLeft: 6,
  },
  filesContainer: {
    marginBottom: 12,
  },
  filesTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  fileName: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#007AFF",
    marginLeft: 6,
    flex: 1,
  },
  submissionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 12,
  },
  submissionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 8,
  },
  submissionItem: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 8,
  },
  submissionDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  submissionMarks: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#34C759",
    marginTop: 2,
  },
  submissionStatus: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#007AFF",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: "#8E8E93",
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#fff",
    marginLeft: 8,
  },
});
