import { useQuery, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {
  FileText,
  Calendar,
  Clock,
  Award,
  Download,
  Upload,
  Info,
} from "lucide-react-native";
import ErrorScreen from "@/components/ui/ErrorScreen";
import React, { useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { GET_DAILY_HOMEWORK_BY_PARENT } from "@/lib/hooks/graphql/ParentQueries";

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

export default function HomeWork() {
  const { id } = useLocalSearchParams();
  const [dateDaily, setDateDaily] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Daily Homework
  const {
    data: dailyData,
    loading: dailyLoading,
    error: dailyError,
    refetch: dailyRefetch,
  } = useQuery(GET_DAILY_HOMEWORK_BY_PARENT, {
    variables: {
      date: dateDaily?.toISOString() ?? new Date().toISOString(),
      studentId: id,
    },
    skip: !id,
  });

  console.log("dateDaily", dateDaily);

  console.log("dailyData", JSON.stringify(dailyData, null, 2));
  const router = useRouter();

  useEffect(() => {
    dailyRefetch();
  }, [dateDaily]);

  const homeworkData: Homework[] =
    dailyData?.getDailyHomeworkByParent?.homeworks || [];

  console.log("homeworkData", JSON.stringify(homeworkData, null, 2));

  const isLoading = dailyLoading;
  const hasError = dailyError;

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading homework...</Text>
      </View>
    );
  }

  if (hasError) {
    return <ErrorScreen onRetry={() => dailyRefetch()} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.comingSoonContainer}>
        {/* Date Picker Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.submitButtonText}>
            {dateDaily ? `Selected: ${formatDate(dateDaily)}` : "Pick Date"}
          </Text>
        </TouchableOpacity>
        {/* Date Picker Modal */}
        {showDatePicker && (
          <RNDateTimePicker
            value={dateDaily || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set") {
                setDateDaily(selectedDate || new Date());
              }
              setShowDatePicker(false); // Always close picker
            }}
          />
        )}
        {/* Homework List */}
        {homeworkData.length > 0 ? (
          <ScrollView style={{ width: "100%" }}>
            {homeworkData.map((hw: any, idx: number) => {
              const isSubmittedDaily =
                hw.submissions && hw.submissions.length > 0;

              return (
                
                <TouchableOpacity
                  key={hw.homeworkId || idx}
                  style={styles.homeworkCard}
                  onPress={() => {
                    router.push({
                      pathname: "/(mainScreen)/homework/[homeworkId]",
                      params: {
                        homeworkId: hw.homeworkId,
                        homework: JSON.stringify(hw),
                      },
                    });
                  }}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                      <FileText size={20} color="#007AFF" />
                      <Text style={styles.homeworkTitle} numberOfLines={2}>
                        {hw.subjectName}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.description} numberOfLines={3}>
                    {hw.title}
                  </Text>
                  <Text style={styles.description} numberOfLines={3}>
                    {hw.description}
                  </Text>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Calendar size={16} color="#8E8E93" />
                      <Text style={styles.detailText}>
                        Due: {formatDate(hw.dueDate)}
                      </Text>
                    </View>
                    {hw.points > 0 && (
                      <View style={styles.detailItem}>
                        <Award size={16} color="#FF9500" />
                        <Text style={styles.detailText}>
                          {hw.points} points
                        </Text>
                      </View>
                    )}
                    {hw.remarks && (
                      <View style={styles.detailItem}>
                        <Info size={16} color="#8E8E93" />
                        <Text style={styles.detailText}>{hw.remarks}</Text>
                      </View>
                    )}
                    {hw.dueDate && (
                      <View style={styles.detailItem}>
                        <Clock size={16} color="#8E8E93" />
                        <Text style={styles.detailText}>
                          Due: {formatDate(hw.dueDate)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {hw.homeworkFiles && hw.homeworkFiles.length > 0 && (
                    <View style={styles.filesContainer}>
                      <Text style={styles.filesTitle}>Attached Files:</Text>
                      {hw.homeworkFiles.map((file: any, fileIndex: number) => (
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
                  {isSubmittedDaily ? (
                    <View style={styles.submissionContainer}>
                      <Text style={styles.submissionTitle}>
                        Your Submission:
                      </Text>
                      {hw.submissions.map(
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
                  ) : (
                    <View style={styles.submissionContainer}>
                      <Text style={styles.submissionTitle}>
                        No Submission Yet
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Homework Available</Text>
            <Text style={styles.emptySubtext}>
              No daily homework found for the selected date.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#FF3B30",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E93",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    textAlign: "center",
  },
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#8E8E93",
    fontFamily: "Inter_500Medium",
  },
  activeTabText: {
    color: "#007AFF",
    fontFamily: "Inter_600SemiBold",
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  comingSoonTitle: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E93",
  },
  comingSoonSubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    textAlign: "center",
  },
});
