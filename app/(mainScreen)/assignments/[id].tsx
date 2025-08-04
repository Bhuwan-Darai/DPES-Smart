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
import { SUBMIT_ASSIGNMENT } from "@/lib/hooks/graphql/queries";

const { width } = Dimensions.get("window");

export default function AssignmentDetailScreen() {
  const { id, assignment } = useLocalSearchParams();
  const assignmentData = assignment ? JSON.parse(assignment as string) : null;
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const [filePath, setFilePath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [submitAssignment, { loading: submitAssignmentLoading }] =
    useMutation(SUBMIT_ASSIGNMENT);

  if (!assignmentData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading assignment details...</Text>
      </View>
    );
  }

  const handleFilePress = (file: any) => {
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
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open file in browser");
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });

      console.log("\nresult", result);

      if (result.assets && result.assets.length > 0) {
        // Upload each file
        const uploadPromises = result.assets.map(async (file) => {
          const formData = new FormData();

          // Clean path if iOS, otherwise use as is
          const uri =
            Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;

          formData.append("file", {
            uri,
            name: file.name || `file-${Date.now()}.pdf`,
            type: file.mimeType || "application/pdf",
          } as any);

          // Add folder path for assignment
          const folderPath = `assignments/${assignmentData.assignmentId}`;

          const response = await fetch(
            `${API_URL}/files/upload?folderPath=${folderPath}`,
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("response", response);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload file");
          }

          const data = await response.json();
          console.log("Uploaded:", data);
          return data.data?.objectName || data.url;
        });

        const uploadedFilePaths = await Promise.all(uploadPromises);
        setFilePath(uploadedFilePaths);

        const dataToSend = {
          assignmentId: assignmentData.assignmentId,
          filePath: uploadedFilePaths,
        };

        console.log("dataToSend", dataToSend);

        await submitAssignment({
          variables: {
            input: dataToSend,
          },
          onCompleted: (data) => {
            console.log("✅ Submission successful:", data);
            Alert.alert("Success", "Assignment submitted successfully!", [
              {
                text: "OK",
                onPress: () => {
                  router.back();
                  // refetch();
                },
              },
            ]);
          },
          onError: (error) => {
            console.error("❌ Submission error:", error);
            Alert.alert(
              "Error",
              "Failed to submit assignment. Please try again.",
              [{ text: "OK" }]
            );
          },
        });

        console.log("✅ Uploaded file paths:", uploadedFilePaths);
      }
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      Alert.alert("Error", "Failed to upload files. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const isCompleted =
    assignmentData.submissions &&
    assignmentData.submissions.length > 0 &&
    assignmentData.submissions.some((sub: any) => sub.status === "submitted");

  const getPdfViewerUrl = (fileUrl: string) => {
    // Use Google Docs Viewer as a fallback
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      fileUrl
    )}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return "#10B981";
      case "active":
        return "#6366F1";
      case "inactive":
        return "#9CA3AF";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return CheckCircle;
      case "active":
        return Clock;
      default:
        return Info;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{assignmentData.title}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getStatusColor(
                    assignmentData.isActive ? "active" : "inactive"
                  ),
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(
                    assignmentData.isActive ? "active" : "inactive"
                  ),
                },
              ]}
            >
              {assignmentData.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
          {isCompleted && (
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={[styles.statusText, { color: "#10B981" }]}>
                Completed
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Assignment Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Assignment Details</Text>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Info size={20} color="#6366F1" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{assignmentData.description}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <FileText size={20} color="#6366F1" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Instructions</Text>
            <Text style={styles.detailValue}>
              {assignmentData.instructions}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Calendar size={20} color="#EF4444" />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={[styles.detailValue, styles.dueDate]}>
              {formatDate(assignmentData.dueDate)}
            </Text>
          </View>
        </View>

        <View style={styles.marksContainer}>
          <View style={styles.markCard}>
            <Award size={20} color="#10B981" />
            <Text style={styles.markLabel}>Full Marks</Text>
            <Text style={styles.markValue}>{assignmentData.fullMarks}</Text>
          </View>
          <View style={styles.markCard}>
            <Award size={20} color="#F59E0B" />
            <Text style={styles.markLabel}>Pass Marks</Text>
            <Text style={styles.markValue}>{assignmentData.passMarks}</Text>
          </View>
        </View>
      </View>

      {/* Assignment Files */}
      {assignmentData.assignmentFiles &&
        assignmentData.assignmentFiles.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Assignment Files</Text>
            <Text style={styles.cardSubtitle}>
              Review these files before submitting your assignment
            </Text>

            <View style={styles.filesContainer}>
              {assignmentData.assignmentFiles.map(
                (file: any, index: number) => (
                  <TouchableOpacity
                    key={file.fileId}
                    style={[
                      styles.fileCard,
                      {
                        marginBottom:
                          index === assignmentData.assignmentFiles.length - 1
                            ? 0
                            : 12,
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
                )
              )}
            </View>
          </View>
        )}

      {/* Submit Assignment */}
      {!isCompleted && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit Assignment</Text>
          <Text style={styles.cardSubtitle}>
            Upload your completed assignment files (PDF format only)
          </Text>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitAssignmentLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitAssignment}
            disabled={submitAssignmentLoading}
            activeOpacity={0.8}
          >
            {submitAssignmentLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Upload size={20} color="#fff" />
            )}
            <Text style={styles.submitButtonText}>
              {submitAssignmentLoading ? "Submitting..." : "Submit Assignment"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submissions */}
      {isCompleted && assignmentData.submissions && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Submissions</Text>

          {assignmentData.submissions.map((submission: any) => (
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
                  {submission.files.map((file: any) => (
                    <TouchableOpacity
                      key={file.fileId}
                      style={styles.submissionFileCard}
                      onPress={() => handleFilePress(file)}
                      activeOpacity={0.7}
                    >
                      <FileText size={18} color="#6366F1" />
                      <Text style={styles.submissionFileName}>
                        Submission File
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
