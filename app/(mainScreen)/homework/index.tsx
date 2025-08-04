// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import {
//   ChevronLeft,
//   Bell,
//   Book,
//   Calendar,
//   Trophy,
//   FileText,
//   AlertCircle,
// } from "lucide-react-native";
// import { useRouter } from "expo-router";

import {
  GET_DAILY_HOMEWORK,
  GET_STUDENT_VACATION_HOMEWORK,
  SUBMIT_DAILY_HOMEWORK,
  SUBMIT_VACATION_HOMEWORK,
} from "@/lib/hooks/graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
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
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";

// const notifications = [
//   {
//     id: "1",
//     type: "assignment",
//     title: "New Assignment Posted",
//     message: "Mathematics: Calculus Assignment 3 is now available",
//     time: "2 hours ago",
//     icon: FileText,
//     color: "#007AFF",
//     unread: true,
//   },
//   {
//     id: "2",
//     type: "achievement",
//     title: "Achievement Unlocked",
//     message: 'Congratulations! You\'ve earned "Perfect Attendance" badge',
//     time: "5 hours ago",
//     icon: Trophy,
//     color: "#FF9500",
//     unread: true,
//   },
//   {
//     id: "3",
//     type: "schedule",
//     title: "Class Schedule Update",
//     message: "Physics class rescheduled to 2:00 PM tomorrow",
//     time: "1 day ago",
//     icon: Calendar,
//     color: "#34C759",
//     unread: false,
//   },
//   {
//     id: "4",
//     type: "exam",
//     title: "Upcoming Test",
//     message: "Chemistry mid-term exam scheduled for next week",
//     time: "2 days ago",
//     icon: AlertCircle,
//     color: "#FF2D55",
//     unread: false,
//   },
//   {
//     id: "5",
//     type: "course",
//     title: "New Course Material",
//     message: "New study materials added to Biology course",
//     time: "3 days ago",
//     icon: Book,
//     color: "#AF52DE",
//     unread: false,
//   },
// ];

// export default function HomeWorkScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Notifications</Text>
//       </View> */}

//       <ScrollView style={styles.content}>
//         <View style={styles.filterContainer}>
//           <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
//             <Text style={[styles.filterText, styles.activeFilterText]}>
//               All
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text style={styles.filterText}>Unread</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Text style={styles.filterText}>Important</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.notificationsContainer}>
//           {notifications.map((notification) => (
//             <TouchableOpacity
//               key={notification.id}
//               style={[
//                 styles.notificationCard,
//                 notification.unread && styles.unreadCard,
//               ]}
//             >
//               <View
//                 style={[
//                   styles.iconContainer,
//                   { backgroundColor: notification.color },
//                 ]}
//               >
//                 <notification.icon size={24} color="#fff" />
//               </View>
//               <View style={styles.notificationContent}>
//                 <Text style={styles.notificationTitle}>
//                   {notification.title}
//                 </Text>
//                 <Text style={styles.notificationMessage}>
//                   {notification.message}
//                 </Text>
//                 <Text style={styles.timeText}>{notification.time}</Text>
//               </View>
//               {notification.unread && <View style={styles.unreadDot} />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F2F2F7",
//     // marginTop: 40,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontFamily: "Inter_600SemiBold",
//     color: "#000",
//   },
//   content: {
//     flex: 1,
//   },
//   filterContainer: {
//     flexDirection: "row",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   activeFilter: {
//     backgroundColor: "#007AFF",
//   },
//   filterText: {
//     fontSize: 14,
//     fontFamily: "Inter_500Medium",
//     color: "#8E8E93",
//   },
//   activeFilterText: {
//     color: "#fff",
//   },
//   notificationsContainer: {
//     padding: 16,
//   },
//   notificationCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   unreadCard: {
//     backgroundColor: "#F8F8F8",
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontFamily: "Inter_600SemiBold",
//     color: "#000",
//     marginBottom: 4,
//   },
//   notificationMessage: {
//     fontSize: 14,
//     fontFamily: "Inter_400Regular",
//     color: "#8E8E93",
//     marginBottom: 8,
//   },
//   timeText: {
//     fontSize: 12,
//     fontFamily: "Inter_400Regular",
//     color: "#8E8E93",
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#007AFF",
//     marginLeft: 8,
//     alignSelf: "center",
//   },
// });

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

export default function HomeWorkScreen() {
  const [selectedTab, setSelectedTab] = useState<"vacation" | "daily">("daily");
  const [currentPageDaily, setCurrentPageDaily] = useState(1);
  const [pageSizeDaily, setPageSizeDaily] = useState(10);
  const [dateDaily, setDateDaily] = useState<Date | null>(null);
  const [fetchDaily, setFetchDaily] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Vacation Homework
  const {
    data: vacationData,
    loading: vacationLoading,
    error: vacationError,
    refetch: vacationRefetch,
  } = useQuery(GET_STUDENT_VACATION_HOMEWORK);

  // Daily Homework
  const {
    data: dailyData,
    loading: dailyLoading,
    error: dailyError,
    refetch: dailyRefetch,
  } = useQuery(GET_DAILY_HOMEWORK, {
    variables: {
      date: dateDaily?.toISOString() ?? new Date().toISOString(),
    },
    skip: !dateDaily,
  });

  console.log("dateDaily", dateDaily);

  console.log("dailyData", JSON.stringify(dailyData, null, 2));
  const router = useRouter();

  useEffect(() => {
    if (dateDaily) {
      dailyRefetch();
    }
  }, [dateDaily]);

  const [submitVacationHomework, { loading: submitLoading }] = useMutation(
    SUBMIT_VACATION_HOMEWORK
  );

  const [submitDailyHomework, { loading: submitLoadingDaily }] = useMutation(
    SUBMIT_DAILY_HOMEWORK
  );

  const homeworkData: Homework[] =
    vacationData?.getStudentVacationHomework?.data || [];
    
  console.log("homeworkData", JSON.stringify(homeworkData, null, 2));

  const isLoading = vacationLoading;
  const hasError = vacationError;

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

  const handleSubmitVacationHomework = async (homework: any) => {
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

          // Add folder path for vacation homework
          const folderPath = `vacation-homework`;

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
          console.log("data", data);
          console.log("Uploaded:", data);
          return data.data?.objectName || data.url; // Adjust based on your backend response
        });

        const uploadedFilePaths = await Promise.all(uploadPromises);

        const dataToSend = {
          vacationId: homework.vacationId,
          filePath: uploadedFilePaths,
        };

        console.log("dataToSend", dataToSend);

        await submitVacationHomework({
          variables: {
            input: dataToSend,
          },
          onCompleted: (data) => {
            console.log("✅ Submission successful:", data);
            vacationRefetch();
            Alert.alert(
              "Success",
              "Vacation homework submitted successfully!",
              [{ text: "OK" }]
            );
          },
          onError: async (error) => {
            const response = await fetch(`${API_URL}/files/delete`, {
              method: "DELETE",
            });
            console.log("response", response);
            console.error("❌ Submission error:", error);
            Alert.alert(
              "Error",
              "Failed to submit vacation homework. Please try again.",
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading homework...</Text>
      </View>
    );
  }

  if (hasError) {
    return <ErrorScreen onRetry={() => vacationRefetch()} />;
  }

  // submit daily homework
  const handleSubmitDailyHomework = async (homework: any) => {
    console.log("homework", homework);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });

      console.log("result", result);

      if (result.assets && result.assets.length > 0) {
        const uploadPromises = result.assets.map(async (file) => {
          const formData = new FormData();

          const uri =
            Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;

          formData.append("file", {
            uri,
            name: file.name || `file-${Date.now()}.pdf`,
            type: file.mimeType || "application/pdf",
          } as any);

          const folderPath = `daily-homework`;

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

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload file");
          }

          const data = await response.json();
          console.log("data", data);
          console.log("Uploaded:", data);
          return data.data?.objectName || data.url; // Adjust based on your backend response
        });

        const uploadedFilePaths = await Promise.all(uploadPromises);

        const dataToSend = {
          homeworkId: homework.homeworkId,
          filePath: uploadedFilePaths,
        };

        console.log("dataToSend", dataToSend);

        await submitDailyHomework({
          variables: {
            input: dataToSend,
          },
          onCompleted: (data) => {
            console.log("✅ Submission successful:", data);
            dailyRefetch();
            Alert.alert("Success", "Daily homework submitted successfully!", [
              { text: "OK" },
            ]);
          },
          onError: async (error) => {
            console.error("❌ Submission error:", error);
            Alert.alert(
              "Error",
              "Failed to submit daily homework. Please try again.",
              [{ text: "OK" }]
            );
            const response = await fetch(`${API_URL}/files/delete`, {
              method: "DELETE",
            });
            console.log("response", response);
            console.error("❌ Submission error:", error);
          },
        });
      }
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      Alert.alert("Error", "Failed to upload files. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "daily" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("daily")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "daily" && styles.activeTabText,
            ]}
          >
            Daily Homework
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "vacation" && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab("vacation")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "vacation" && styles.activeTabText,
            ]}
          >
            Vacation Homework
          </Text>
        </TouchableOpacity>
      </View>
      {/* Tab Content */}
      {selectedTab === "vacation" ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {homeworkData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={48} color="#8E8E93" />
              <Text style={styles.emptyTitle}>No Homework Available</Text>
              <Text style={styles.emptySubtext}>
                You don't have any vacation homework assigned at the moment.
              </Text>
            </View>
          ) : (
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
                        pathname: "/(mainScreen)/homework/[id]",
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

                    {isSubmitted ? (
                      <View style={styles.submissionContainer}>
                        <Text style={styles.submissionTitle}>
                          Your Submission:
                        </Text>
                        {homework.submissions.map(
                          (submission: any, subIndex: number) => (
                            <View
                              key={submission.submissionId || subIndex}
                              style={styles.submissionItem}
                            >
                              <Text style={styles.submissionDate}>
                                Submitted:{" "}
                                {formatDate(submission.submissionDate)}
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
                      <TouchableOpacity
                        style={[
                          styles.submitButton,
                          submitLoading && styles.submitButtonDisabled,
                        ]}
                        onPress={() => handleSubmitVacationHomework(homework)}
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Upload size={16} color="#fff" />
                        )}
                        <Text style={styles.submitButtonText}>
                          {submitLoading ? "Submitting..." : "Submit Homework"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      ) : (
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
                  setFetchDaily(true);
                }
                setShowDatePicker(false); // Always close picker
              }}
            />
          )}
          {/* Fetch Button and Homework List */}
          {!dateDaily ? (
            <Text style={styles.comingSoonSubtext}>
              Please select a date to view daily homework.
            </Text>
          ) : !fetchDaily ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setFetchDaily(true)}
            >
              <Text style={styles.submitButtonText}>Fetch Homework</Text>
            </TouchableOpacity>
          ) : dailyLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : dailyError ? (
            <ErrorScreen onRetry={() => dailyRefetch()} />
          ) : dailyData &&
            dailyData.getDailyHomework &&
            dailyData.getDailyHomework.homeworks.length > 0 ? (
            <ScrollView style={{ width: "100%" }}>
              {dailyData.getDailyHomework.homeworks.map(
                (hw: any, idx: number) => {
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
                          {hw.homeworkFiles.map(
                            (file: any, fileIndex: number) => (
                              <View
                                key={file.fileId || fileIndex}
                                style={styles.fileItem}
                              >
                                <Download size={16} color="#007AFF" />
                                <Text style={styles.fileName} numberOfLines={1}>
                                  {file.fileName}
                                </Text>
                              </View>
                            )
                          )}
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
                                  Submitted:{" "}
                                  {formatDate(submission.submissionDate)}
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
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={() => handleSubmitDailyHomework(hw)}
                          disabled={submitLoadingDaily}
                        >
                          {submitLoadingDaily ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Upload size={16} color="#fff" />
                          )}
                          <Text style={styles.submitButtonText}>
                            {submitLoadingDaily
                              ? "Submitting..."
                              : "Submit Homework"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
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
      )}
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
