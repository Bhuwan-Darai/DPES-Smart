import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FileText,
  Download,
  X,
  Upload,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "@/lib/constants";
import { useMutation } from "@apollo/client";
import {
  GET_STUDENT_VACATION_HOMEWORK,
  SUBMIT_VACATION_HOMEWORK,
} from "@/lib/hooks/graphql/queries";

const { width } = Dimensions.get("window");

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
  const { id, homework } = useLocalSearchParams();
  const homeworkData: Homework = homework
    ? JSON.parse(homework as string)
    : null;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const [filePath, setFilePath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [submitVacationHomework, { loading: submitAssignmentLoading }] =
    useMutation(SUBMIT_VACATION_HOMEWORK);

  console.log("homeworkData", JSON.stringify(homeworkData, null, 2));

  if (!homeworkData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading homework details...</Text>
      </View>
    );
  }

  const handleFilePress = (file: File) => {
    setSelectedFile(file);
    setIsModalVisible(true);
  };

  const handleDownload = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const handleViewFile = async (url: string) => {
    console.log("url", url);
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open file in browser");
    }
  };

  const isSubmitted =
    homeworkData.submissions && homeworkData.submissions.length > 0;

  const formatDate = (dateStringOrTimestamp: string | number): string => {
    let timestamp: number;

    if (typeof dateStringOrTimestamp === "string") {
      // Try parsing as ISO string
      const parsedDate = new Date(dateStringOrTimestamp);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("en-US", {
          timeZone: "Asia/Kathmandu",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      // If not valid, try converting string to number (timestamp)
      timestamp = parseInt(dateStringOrTimestamp, 10);
    } else if (typeof dateStringOrTimestamp === "number") {
      timestamp = dateStringOrTimestamp;
    } else {
      console.error("Invalid date input:", dateStringOrTimestamp);
      return "Invalid Date";
    }

    const date = new Date(timestamp);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{homeworkData.subjectName}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getStatusColor(homeworkData.endDate),
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(homeworkData.endDate),
                },
              ]}
            >
              {getStatusColor(homeworkData.endDate) === "#FF3B30"
                ? "Overdue"
                : "Active"}
            </Text>
          </View>
          {isSubmitted && (
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={[styles.statusText, { color: "#10B981" }]}>
                Submitted
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Homework Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Homework Details</Text>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <FileText size={20} color="#6366F1" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailValue}>{homeworkData.title}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Info size={20} color="#6366F1" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{homeworkData.description}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Calendar size={20} color="#EF4444" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(homeworkData.startDate)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Clock size={20} color="#EF4444" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>End Date</Text>
            <Text style={[styles.detailValue, styles.dueDate]}>
              {formatDate(homeworkData.endDate)}
            </Text>
          </View>
        </View>

        {homeworkData.points > 0 && (
          <View style={styles.marksContainer}>
            <View style={styles.markCard}>
              <Award size={20} color="#10B981" />
              <Text style={styles.markLabel}>Points</Text>
              <Text style={styles.markValue}>{homeworkData.points}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Homework Files */}
      {homeworkData.files && homeworkData.files.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Homework Files</Text>
          <Text style={styles.cardSubtitle}>
            Review these files before submitting your homework
          </Text>

          <View style={styles.filesContainer}>
            {homeworkData.files.map((file: File, index: number) => (
              <TouchableOpacity
                key={file.fileId}
                style={[
                  styles.fileCard,
                  {
                    marginBottom:
                      index === homeworkData.files.length - 1 ? 0 : 12,
                  },
                ]}
                onPress={() => handleFilePress(file)}
                activeOpacity={0.7}
              >
                <View style={styles.fileIcon}>
                  <FileText size={24} color="#6366F1" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.fileName}</Text>
                  <Text style={styles.fileType}>PDF Document</Text>
                </View>
                <View style={styles.downloadIcon}>
                  <Download size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Submit Homework */}
      {!isSubmitted && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit Homework</Text>
          <Text style={styles.cardSubtitle}>
            Upload your completed homework files (PDF format only)
          </Text>
        </View>
      )}

      {/* Submissions */}
      {isSubmitted && homeworkData.submissions && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Submissions</Text>

          {homeworkData.submissions.map((submission: Submission) => (
            <View key={submission.submissionId} style={styles.submissionCard}>
              <View style={styles.submissionHeader}>
                <View style={styles.submissionStatus}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.submissionStatusText}>
                    {submission.status}
                  </Text>
                </View>
                <Text style={styles.submissionDate}>
                  {formatDate(submission.submissionDate)}
                </Text>
              </View>

              {submission.marks && (
                <View style={styles.submissionDetail}>
                  <Award size={16} color="#F59E0B" />
                  <Text style={styles.submissionDetailText}>
                    Marks: {submission.marks}
                  </Text>
                </View>
              )}

              {submission.remarks && (
                <View style={styles.submissionDetail}>
                  <Info size={16} color="#6366F1" />
                  <Text style={styles.submissionDetailText}>
                    {submission.remarks}
                  </Text>
                </View>
              )}

              {submission.files && submission.files.length > 0 && (
                <View style={styles.submissionFiles}>
                  <Text style={styles.submissionFilesTitle}>
                    Submitted Files:
                  </Text>
                  {submission.files.map((file: File) => (
                    <TouchableOpacity
                      key={file.fileId}
                      style={styles.submissionFileCard}
                      onPress={() => handleFilePress(file)}
                      activeOpacity={0.7}
                    >
                      <FileText size={18} color="#6366F1" />
                      <Text style={styles.submissionFileName}>
                        {file.fileName || "Submission File"}
                      </Text>
                      <Download size={18} color="#6B7280" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
                activeOpacity={0.7}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>

              {selectedFile && (
                <View style={styles.modalBody}>
                  <View style={styles.modalFileIcon}>
                    <FileText size={48} color="#6366F1" />
                  </View>
                  <Text style={styles.modalFileName}>
                    {selectedFile.fileName || "File"}
                  </Text>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.viewButton]}
                      onPress={() => handleViewFile(selectedFile.fileUrl)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalButtonText}>View File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.downloadButton]}
                      onPress={() => handleDownload(selectedFile.fileUrl)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalButtonText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 36,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  completedBadge: {
    backgroundColor: "#ECFDF5",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
  },
  dueDate: {
    color: "#EF4444",
    fontWeight: "600",
  },
  marksContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  markCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  markLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  markValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  filesContainer: {
    gap: 0,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  fileType: {
    fontSize: 14,
    color: "#6B7280",
  },
  downloadIcon: {
    padding: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submissionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  submissionStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submissionStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    textTransform: "capitalize",
  },
  submissionDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  submissionDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  submissionDetailText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  submissionFiles: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  submissionFilesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  submissionFileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  submissionFileName: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(245, 245, 244, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 32,
    alignItems: "center",
  },
  modalFileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalFileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#10B981",
  },
  downloadButton: {
    backgroundColor: "#6366F1",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
