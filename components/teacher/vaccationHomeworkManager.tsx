import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
  Platform,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CLASSROOMS_QUERY,
  GET_SECTIONS_QUERY,
  GET_SUBJECTS_QUERY,
  GET_VACATION_HOMEWORKS_BY_TEACHER,
  CREATE_VACATION_HOMEWORK_MUTATION,
  DELETE_VACATION_HOMEWORK_MUTATION,
  UPDATE_VACATION_HOMEWORK_MUTATION,
} from "@/lib/hooks/graphql/TeacherQueries";
import { API_URL } from "@/lib/constants";

// Define interfaces for our data structures
interface HomeworkFileInput {
  fileName: string;
  fileUrl: string;
  filePath?: string;
}

interface HomeworkItem {
  vacationId?: string;
  classId: string;
  sectionIds: string | string[];
  subjectId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  points: string;
  vacationFiles: HomeworkFileInput[];
  vacationType: "summer" | "winter" | "other" | "";
  submissions?: {
    submissionId: string;
    studentId: string;
    submissionDate: string;
    marks: number;
    remarks: string;
    status: string;
    files: {
      fileId: string;
      fileUrl: string;
      fileName: string;
    }[];
  }[];
}

interface Filters {
  classId: string;
  className: string;
  sectionIds: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface ClassData {
  id: string;
  classId: string;
  className: string;
  classVisible: boolean;
  sectionIds: string[];
  groupIds: string[];
  subjectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SectionData {
  id: string;
  sectionId: string;
  sectionName: string;
  sectionVisible: boolean;
}

interface SubjectData {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectVisible: boolean;
}

interface HomeworkFile {
  fileId?: string;
  fileUrl: string;
  fileName: string;
  filePath: string;
}

const VacationHomeworkManager = () => {
  // Form state
  const [formData, setFormData] = useState<HomeworkItem>({
    classId: "",
    sectionIds: "",
    subjectId: "",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    points: "",
    vacationFiles: [],
    vacationType: "",
  });

  // UI state
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingHomeworkId, setEditingHomeworkId] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deletingHomeworkId, setDeletingHomeworkId] = useState<string>("");

  // Homework list and filters
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [filters, setFilters] = useState<Filters>({
    classId: "",
    className: "",
    sectionIds: "",
    sectionName: "",
    subjectId: "",
    subjectName: "",
    dateFrom: null,
    dateTo: null,
  });

  // States for the dropdown data
  const [classesData, setClassesData] = useState<ClassData[]>([]);
  const [sectionsData, setSectionsData] = useState<SectionData[]>([]);
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);

  // State to store uploaded files
  const [selectedFile, setSelectedFile] = useState<any[]>([]);
  const [filePath, setFilePath] = useState<(string | HomeworkFile)[]>([]);

  // States to filter homeworks
  const [filterClass, setFilterClass] = useState<string>("");
  const [filterSections, setFilterSections] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Query to get the classrooms, sections, and subjects
  const { data: subjectDatas } = useQuery(GET_SUBJECTS_QUERY);
  const { data: classDatas } = useQuery(GET_CLASSROOMS_QUERY);
  const { data: sectionDatas } = useQuery(GET_SECTIONS_QUERY);

  // Query to get the homeworks
  const {
    data: homeworksData,
    loading: homeworksLoading,
    error: homeworksError,
    refetch,
    fetchMore,
  } = useQuery(GET_VACATION_HOMEWORKS_BY_TEACHER, {
    variables: {
      filters: {
        classId: filterClass || undefined,
        subjectId: filterSubject || undefined,
        sectionIds: filterSections.length > 0 ? filterSections : undefined,
      },
      pagination: {
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      },
    },
    fetchPolicy: "network-only",
  });

  console.log("homeworkData", JSON.stringify(homeworksData, null, 2));

  // Mutations
  const [
    createVacationHomework,
    {
      loading: createVacationHomeworkLoading,
      error: createVacationHomeworkError,
    },
  ] = useMutation(CREATE_VACATION_HOMEWORK_MUTATION);
  const [
    updateHomework,
    { loading: updateHomeworkLoading, error: updateHomeworkError },
  ] = useMutation(UPDATE_VACATION_HOMEWORK_MUTATION);
  const [
    deleteHomework,
    { loading: deleteHomeworkLoading, error: deleteHomeworkError },
  ] = useMutation(DELETE_VACATION_HOMEWORK_MUTATION);

  console.log(
    "createVacationHomeworkError",
    JSON.stringify(createVacationHomeworkError, null, 2)
  );
  console.log(
    "updateHomeworkError",
    JSON.stringify(updateHomeworkError, null, 2)
  );
  console.log(
    "deleteHomeworkError",
    JSON.stringify(deleteHomeworkError, null, 2)
  );

  // Set data to states
  useEffect(() => {
    if (subjectDatas?.subjects) {
      setSubjectsData(subjectDatas.subjects);
    }
  }, [subjectDatas]);

  useEffect(() => {
    if (classDatas?.classrooms) {
      setClassesData(classDatas.classrooms);
    }
  }, [classDatas]);

  useEffect(() => {
    if (sectionDatas?.sections) {
      setSectionsData(sectionDatas.sections);
    }
  }, [sectionDatas]);

  // Set homework list
  useEffect(() => {
    if (homeworksData?.getVacationHomeworksByTeacher?.homeworks) {
      const formattedHomeworks =
        homeworksData.getVacationHomeworksByTeacher.homeworks.map(
          (homework: any) => ({
            ...homework,
            startDate: new Date(homework.startDate),
            endDate: new Date(homework.endDate),
          })
        );
      setHomeworkList(formattedHomeworks);
    }
  }, [homeworksData]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterClass, filterSubject, filterSections]);

  const handleInputChange = useCallback(
    (field: keyof HomeworkItem, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleDateChange = useCallback(
    (event: any, selectedDate: Date | undefined) => {
      const currentDate = selectedDate || formData.startDate;
      setShowDatePicker(Platform.OS === "ios");
      handleInputChange("startDate", currentDate);
    },
    [formData.startDate, handleInputChange]
  );

  const handleEndDateChange = useCallback(
    (event: any, selectedDate: Date | undefined) => {
      const currentDate = selectedDate || formData.endDate;
      setShowEndDatePicker(Platform.OS === "ios");
      handleInputChange("endDate", currentDate);
    },
    [formData.endDate, handleInputChange]
  );

  //   const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
  //     console.log("selectedTime", selectedTime);
  //     if (event.type === "set" && selectedTime) {
  //       // Manual UTC to local time conversion
  //       const utcYear = selectedTime.getUTCFullYear();
  //       const utcMonth = selectedTime.getUTCMonth();
  //       const utcDate = selectedTime.getUTCDate();
  //       const utcHours = selectedTime.getUTCHours();
  //       const utcMinutes = selectedTime.getUTCMinutes();

  //       const localTime = new Date(
  //         Date.UTC(utcYear, utcMonth, utcDate, utcHours, utcMinutes)
  //       );

  //       // Debug output — use .getHours()/.getMinutes()
  //       console.log("UTC hours:", utcHours); // should be 4
  //       console.log("UTC minutes:", utcMinutes); // should be 15
  //       console.log("Local hours:", localTime.getHours()); // should be 10 (if in UTC+5:45)
  //       console.log("Local minutes:", localTime.getMinutes());

  //       const dueTime = new Date(localTime).toLocaleTimeString("en-US", {
  //         hour12: false,
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         timeZone: "Asia/Kathmandu",
  //       });

  //       console.log("dueTime", dueTime);

  //       setFormData((prev) => ({
  //         ...prev,
  //         dueTime: timeStringToDate(dueTime).toString(),
  //       }));

  //       const currentDate = new Date(formData.startDate);
  //       currentDate.setHours(0, 0, 0, 0); // reset existing time

  //       console.log("localTime", localTime);

  //       // Set local time
  //       currentDate.setHours(localTime.getHours(), localTime.getMinutes(), 0, 0);

  //       setShowEndDatePicker(Platform.OS === "ios");
  //       // handleInputChange("dueTime", currentDate);
  //     } else {
  //       setShowEndDatePicker(Platform.OS === "ios");
  //     }
  //   };

  //   function timeStringToDate(timeStr: string) {
  //     const [hours, minutes] = timeStr.split(":").map(Number);
  //     console.log("hourseeee", hours, minutes);
  //     const now = new Date(); // Use today's date
  //     now.setHours(hours);
  //     now.setMinutes(minutes);
  //     now.setSeconds(0);
  //     now.setMilliseconds(0);
  //     console.log("now", now);
  //     return now;
  //   }
  // console.log("formdATa", JSON.stringify(formData, null, 2));

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFile((prevFiles) => [...prevFiles, ...result.assets]);

        const uploadPromises = result.assets.map(async (file) => {
          const formData = new FormData();
          const uri =
            Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;

          formData.append("file", {
            uri,
            name: file.name || `file-${Date.now()}.pdf`,
            type: file.mimeType || "application/pdf",
          } as any);

          const folderPath = `homework/vaccationHomework`;
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
          return data.data?.objectName || data.url;
        });

        const uploadedFilePaths = await Promise.all(uploadPromises);
        setFilePath(uploadedFilePaths);
        Alert.alert("Success", "Homework files uploaded successfully!");
      }

      if (result && !("cancel" in result)) {
        handleInputChange("vacationFiles", result);
      }
    } catch (err) {
      console.log("Document picker error:", err);
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof HomeworkItem)[] = [
      "classId",
      "sectionIds",
      "subjectId",
      "title",
      "description",
      "points",
      "vacationType",
      "startDate",
      "endDate",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert(
          "Error",
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field`
        );
        return false;
      }
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      Alert.alert("Error", "End date cannot be before start date");
      return false;
    }

    return true;
  };

  // Submit Homework
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const dataToSend = {
      title: formData.title,
      description: formData.description,
      classId: formData.classId,
      subjectId: formData.subjectId,
      sectionIds: Array.isArray(formData.sectionIds)
        ? formData.sectionIds
        : [formData.sectionIds].filter(Boolean),
      vacationType: formData.vacationType,
      startDate: formData.startDate.toISOString().split("T")[0],
      endDate: formData.endDate.toISOString().split("T")[0],
      points: Number(formData.points),
      homeworkFiles: filePath.map((file) => {
        if (typeof file === "string") {
          const fileName = file.split("/").pop() || "";
          return {
            fileName: decodeURIComponent(fileName),
            fileUrl: file,
          };
        }
        return {
          fileName: file.fileName,
          fileUrl: file.fileUrl,
        };
      }),
    };

    console.log("dataToSend", JSON.stringify(dataToSend, null, 2));

    try {
      const { data } = await createVacationHomework({
        variables: { input: dataToSend },
      });

      if (data.createVaccationHomework.success === true) {
        Alert.alert("Success", "Vacation Homework added successfully!");
        handleModalClose();
        refetch();
      } else {
        Alert.alert(
          "Error",
          data.createVaccationHomework.message ||
            "Failed to create vacation homework"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to create vacation homework");
      }
    }
  };

  // Add New Homework
  const handleAddNew = () => {
    setIsEditing(false);
    setEditingHomeworkId("");
    setFormData({
      classId: "",
      sectionIds: "",
      subjectId: "",
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      points: "",
      vacationFiles: [],
      vacationType: "",
    });
    setFilePath([]);
    setSelectedFile([]);
    setShowAddForm(true);
  };

  // Edit Homework
  const handleEdit = (homework: any) => {
    console.log("homework", homework);
    setEditingHomeworkId(homework.vacationId);
    setFormData({
      classId: homework.classId,
      sectionIds: Array.isArray(homework.sectionIds)
        ? homework.sectionIds[0]
        : homework.sectionIds,
      subjectId: homework.subjectId,
      title: homework.title,
      description: homework.description,
      startDate: new Date(homework.startDate),
      endDate: new Date(homework.endDate),
      points: homework.points.toString(),
      vacationFiles: homework.vacationFiles || [],
      vacationType: homework.vacationType || "",
    });
    setFilePath(
      homework.vacationFiles?.map((file: HomeworkFile) => ({
        fileId: file.fileId,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        filePath: file.filePath,
      })) || []
    );
    setIsEditing(true);
    setShowAddForm(true);
  };

  // Update Homework
  const handleUpdate = async () => {
    if (!validateForm()) return;

    const dataToSend = {
      id: editingHomeworkId,
      classId: formData.classId,
      sectionIds: Array.isArray(formData.sectionIds)
        ? formData.sectionIds
        : [formData.sectionIds].filter(Boolean),
      subjectId: formData.subjectId,
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate.toISOString().split("T")[0],
      endDate: formData.endDate.toISOString().split("T")[0],
      vacationType: formData.vacationType,
      points: Number(formData.points),
      homeworkFiles: filePath.map((file) => {
        if (typeof file === "string") {
          // This is a new file
          const fileName = file.split("/").pop() || "";
          return {
            fileName: decodeURIComponent(fileName),
            fileUrl: file,
          };
        }
        // This is an existing file
        return {
          fileName: file.fileName,
          fileUrl: file.filePath,
        };
      }),
    };

    console.log("dataToSend", JSON.stringify(dataToSend, null, 2));

    await updateHomework({
      variables: { input: dataToSend },
      onCompleted: (data) => {
        if (data.updateVaccationHomework.success === true) {
          Alert.alert("Success", "Homework updated successfully!");
          setShowAddForm(false);
          setIsEditing(false);
          refetch();
        } else {
          Alert.alert("Error", data.updateVaccationHomework.message);
        }
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });
  };

  // Delete Homework
  const handleDelete = (homeworkId: string) => {
    setDeletingHomeworkId(homeworkId);
    setShowDeleteConfirm(true);
  };

  // Confirm Delete Homework
  const confirmDelete = async () => {
    await deleteHomework({
      variables: { id: deletingHomeworkId },
      onCompleted: (data) => {
        if (data.removeVaccationHomework.success === true) {
          Alert.alert("Success", "Homework deleted successfully!");
          setShowDeleteConfirm(false);
          refetch();
        } else {
          Alert.alert("Error", data.removeVaccationHomework.message);
        }
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });
  };

  // View Document
  const viewDocument = async (fileUrl: string) => {
    console.log("fileUrl", fileUrl);
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert("Error", "Cannot open this file type");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open document");
    }
  };

  // Format Date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  // Format Time
  const formatTime = (time: Date) => {
    if (!time) return "";

    // Convert to Nepal time for display
    const nepalOffset = 5 * 60 + 45; // Nepal is UTC+5:45
    const localOffset = time.getTimezoneOffset();
    const totalOffset = nepalOffset + localOffset;

    const nepalTime = new Date(time.getTime() + totalOffset * 60000);
    return nepalTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Render Homework Item
  const renderHomeworkItem = ({ item }: { item: HomeworkItem }) => {
    const classObj = classesData.find((cls) => cls.classId === item.classId);
    const className = classObj ? classObj.className : item.classId;

    let sectionNames = "";
    if (Array.isArray(item.sectionIds)) {
      sectionNames = item.sectionIds
        .map((secId: string) => {
          const secObj = sectionsData.find((sec) => sec.sectionId === secId);
          return secObj ? secObj.sectionName : secId;
        })
        .join(", ");
    } else if (typeof item.sectionIds === "string") {
      sectionNames = item.sectionIds
        .split(",")
        .map((secId: string) => {
          const secObj = sectionsData.find(
            (sec) => sec.sectionId === secId.trim()
          );
          return secObj ? secObj.sectionName : secId.trim();
        })
        .join(", ");
    }

    const subjectObj = subjectsData.find(
      (sub) => sub.subjectId === item.subjectId
    );
    const subjectName = subjectObj ? subjectObj.subjectName : item.subjectId;

    return (
      <View style={styles.homeworkCard}>
        <View className="flex-row justify-between items-start mb-3">
          <Text style={styles.homeworkTitle} className="flex-1 mr-3">
            {item.title}
          </Text>
          <View style={styles.pointsBadge}>
            <Text className="text-blue-600 text-xs font-semibold">
              {item.points} pts
            </Text>
          </View>
        </View>

        <View className="flex-row mb-3">
          <Text className="text-sm text-gray-600 mr-4">
            <Text className="font-medium">Class:</Text> {className}
          </Text>
          <Text className="text-sm text-gray-600 mr-4">
            <Text className="font-medium">Section:</Text> {sectionNames}
          </Text>
          <Text className="text-sm text-gray-600">
            <Text className="font-medium">Subject:</Text> {subjectName}
          </Text>
        </View>

        <Text className="text-sm text-gray-700 mb-4 leading-5">
          {item.description}
        </Text>

        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-xs text-gray-500 font-medium">
              Date Range
            </Text>
            <Text className="text-sm font-semibold text-gray-800">
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Text>
          </View>
          {item.vacationFiles && item.vacationFiles.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Text className="text-green-600 text-xs font-medium">
                📎 {item.vacationFiles.length} Attachment(s)
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text className="text-white font-semibold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.vacationId || "")}
          >
            <Text className="text-white text-color-[#DC2626] font-semibold">
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* File Attachments */}
        {item.vacationFiles && item.vacationFiles.length > 0 && (
          <View className="mt-2">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Attachments:
            </Text>
            {item.vacationFiles.map((file: any, index: number) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-50 p-3 rounded-lg mb-2 flex-row justify-between items-center border border-gray-100"
                onPress={() => viewDocument(file.fileUrl)}
              >
                <Text className="text-gray-600 text-sm flex-1 font-medium">
                  📄 {file.fileName}
                </Text>
                <Text className="text-blue-500 text-xs font-semibold">
                  View
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Submissions */}
        {item.submissions && item.submissions.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Submissions ({item.submissions.length})
            </Text>
            {item.submissions.map((submission, index) => (
              <View
                key={submission.submissionId}
                className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-100"
              >
                <Text className="text-gray-700 font-medium">
                  Student ID: {submission.studentId}
                </Text>
                <Text className="text-gray-600 text-sm">
                  Submitted:{" "}
                  {new Date(submission.submissionDate).toLocaleDateString()}
                </Text>
                <Text className="text-gray-600 text-sm">
                  Marks: {submission.marks} | Status: {submission.status}
                </Text>
                {submission.remarks && (
                  <Text className="text-gray-600 text-sm">
                    Remarks: {submission.remarks}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Memoized FilterSection component to prevent unnecessary re-renders
  // Filter Section
  const FilterSection = React.memo(() => {
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const selectedFilterClass = classesData.find(
      (cls) => cls.classId === filters.classId
    );
    const filteredFilterSections = selectedFilterClass
      ? sectionsData.filter((sec) =>
          selectedFilterClass.sectionIds.includes(sec.sectionId)
        )
      : sectionsData;
    const filteredFilterSubjects = selectedFilterClass
      ? subjectsData.filter((sub) =>
          selectedFilterClass.subjectIds.includes(sub.subjectId)
        )
      : subjectsData;

    // Stabilize filter updates
    const updateFilters = useCallback(
      (newFilters: Partial<Filters>) => {
        setFilters((prev) => {
          const updated = { ...prev, ...newFilters };
          // Only update if there's a change to prevent infinite loops
          if (
            JSON.stringify(updated) !== JSON.stringify(prev) &&
            (!newFilters.sectionIds ||
              filteredFilterSections.some(
                (sec) => sec.sectionId === newFilters.sectionIds
              )) &&
            (!newFilters.subjectId ||
              filteredFilterSubjects.some(
                (sub) => sub.subjectId === newFilters.subjectId
              ))
          ) {
            // Update filter states for query
            setFilterClass(updated.classId);
            setFilterSections(updated.sectionIds ? [updated.sectionIds] : []);
            setFilterSubject(updated.subjectId);
            return updated;
          }
          return prev;
        });
      },
      [filteredFilterSections, filteredFilterSubjects]
    );

    // useEffect to reset invalid sectionIds and subjectId for modal
    useEffect(() => {
      if (filters.classId && selectedFilterClass) {
        let shouldUpdate = false;
        let newSectionIds = filters.sectionIds;
        let newSubjectId = filters.subjectId;

        if (
          filters.sectionIds &&
          !filteredFilterSections.some(
            (sec) => sec.sectionId === filters.sectionIds
          )
        ) {
          newSectionIds = "";
          shouldUpdate = true;
        }

        if (
          filters.subjectId &&
          !filteredFilterSubjects.some(
            (sub) => sub.subjectId === filters.subjectId
          )
        ) {
          newSubjectId = "";
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          updateFilters({
            sectionIds: newSectionIds,
            subjectId: newSubjectId,
          });
        }
      }
    }, [
      filters.classId,
      filters.sectionIds,
      filters.subjectId,
      selectedFilterClass,
      filteredFilterSections,
      filteredFilterSubjects,
      updateFilters,
    ]);

    return (
      <View style={styles.filterSection}>
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Filter Vacation Homework
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: "#0F172A" }}
              className="text-xs font-semibold mb-1"
            >
              Class
            </Text>
            <View style={[styles.pickerContainer, { marginBottom: 0 }]}>
              <Picker
                selectedValue={filters.classId}
                onValueChange={(value) => {
                  const selectedClass = classesData.find(
                    (cls) => cls.classId === value
                  );
                  updateFilters({
                    classId: value,
                    className: selectedClass ? selectedClass.className : "",
                  });
                }}
                style={[styles.picker]}
                dropdownIconColor="#2563EB"
              >
                <Picker.Item label="All Classes" value="" color="#64748B" />
                {classesData.map((cls) => (
                  <Picker.Item
                    key={cls.classId}
                    label={cls.className}
                    value={cls.classId}
                    color={
                      filters.classId === cls.classId ? "#2563EB" : "#1F2937"
                    }
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{ color: "#0F172A" }}
              className="text-xs font-semibold mb-1"
            >
              Section
            </Text>
            <View style={[styles.pickerContainer, { marginBottom: 0 }]}>
              <Picker
                selectedValue={filters.sectionIds}
                onValueChange={(value) => {
                  const selectedSection = sectionsData.find(
                    (sec) => sec.sectionId === value
                  );
                  updateFilters({
                    sectionIds: value,
                    sectionName: selectedSection
                      ? selectedSection.sectionName
                      : "",
                  });
                }}
                style={[styles.picker]}
                enabled={!!filters.classId}
                dropdownIconColor="#2563EB"
              >
                <Picker.Item label="All Sections" value="" color="#64748B" />
                {filteredFilterSections.map((sec) => (
                  <Picker.Item
                    key={sec.sectionId}
                    label={sec.sectionName}
                    value={sec.sectionId}
                    color={
                      filters.sectionIds === sec.sectionId
                        ? "#2563EB"
                        : "#1F2937"
                    }
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text
              style={{ color: "#0F172A" }}
              className="text-xs font-semibold mb-1"
            >
              Subject
            </Text>
            <View style={[styles.pickerContainer, { marginBottom: 0 }]}>
              <Picker
                selectedValue={filters.subjectId}
                onValueChange={(value) => {
                  const selectedSubject = subjectsData.find(
                    (sub) => sub.subjectId === value
                  );
                  updateFilters({
                    subjectId: value,
                    subjectName: selectedSubject
                      ? selectedSubject.subjectName
                      : "",
                  });
                }}
                style={[styles.picker]}
                enabled={!!filters.classId}
                dropdownIconColor="#2563EB"
              >
                <Picker.Item label="All Subjects" value="" color="#64748B" />
                {filteredFilterSubjects.map((sub) => (
                  <Picker.Item
                    key={sub.subjectId}
                    label={sub.subjectName}
                    value={sub.subjectId}
                    color={
                      filters.subjectId === sub.subjectId
                        ? "#2563EB"
                        : "#1F2937"
                    }
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={() =>
            updateFilters({
              classId: "",
              className: "",
              sectionIds: "",
              sectionName: "",
              subjectId: "",
              subjectName: "",
              dateFrom: null,
              dateTo: null,
            })
          }
          className="mt-3 w-full"
        >
          <Text className="text-white text-xs font-medium text-center">
            Clear Filters
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  // Modal (Form) Filtering
  const selectedClassForModal = classesData.find(
    (cls) => cls.classId === formData.classId
  );
  const filteredSectionsForModal = selectedClassForModal
    ? sectionsData.filter((sec) =>
        selectedClassForModal.sectionIds.includes(sec.sectionId)
      )
    : sectionsData;
  const filteredSubjectsForModal = selectedClassForModal
    ? subjectsData.filter((sub) =>
        selectedClassForModal.subjectIds.includes(sub.subjectId)
      )
    : subjectsData;

  // useEffect for Modal (Form) to reset invalid sectionIds and subjectId for modal
  useEffect(() => {
    if (formData.classId && selectedClassForModal) {
      let shouldUpdate = false;
      let newSectionIds = formData.sectionIds;
      let newSubjectId = formData.subjectId;

      if (
        formData.sectionIds &&
        !filteredSectionsForModal.some(
          (sec) => sec.sectionId === formData.sectionIds
        )
      ) {
        newSectionIds = "";
        shouldUpdate = true;
      }

      if (
        formData.subjectId &&
        !filteredSubjectsForModal.some(
          (sub) => sub.subjectId === formData.subjectId
        )
      ) {
        newSubjectId = "";
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setFormData((prev) => ({
          ...prev,
          sectionIds: newSectionIds,
          subjectId: newSubjectId,
        }));
      }
    }
  }, [
    formData.classId,
    formData.sectionIds,
    formData.subjectId,
    selectedClassForModal,
    filteredSectionsForModal,
    filteredSubjectsForModal,
  ]);

  const handleRemoveFile = async (file: string | HomeworkFile) => {
    console.log("file", file);
    try {
      const filePathToDelete = typeof file === "string" ? file : file.filePath;

      const response = await fetch(
        `${API_URL}/files/${encodeURIComponent(filePathToDelete)}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Alert.alert("Success", "File deleted successfully!");
        setFilePath((prev) => {
          if (typeof file === "string") {
            return prev.filter((f) => f !== file);
          } else {
            return prev.filter(
              (f) => typeof f !== "string" && f.fileId !== file.fileId
            );
          }
        });
      } else {
        Alert.alert("Error", "Failed to delete file!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const loadMoreHomeworks = () => {
    if (homeworksLoading || !homeworksData) return;

    const total = homeworksData.getVacationHomeworksByTeacher.total;
    const hasMore = homeworkList.length < total;

    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
      fetchMore({
        variables: {
          filters: {
            classId: filterClass || undefined,
            subjectId: filterSubject || undefined,
            sectionIds: filterSections.length > 0 ? filterSections : undefined,
          },
          pagination: {
            skip: currentPage * pageSize,
            take: pageSize,
          },
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            ...prevResult,
            getVacationHomeworksByTeacher: {
              ...prevResult.getVacationHomeworksByTeacher,
              homeworks: [
                ...prevResult.getVacationHomeworksByTeacher.homeworks,
                ...fetchMoreResult.getVacationHomeworksByTeacher.homeworks,
              ],
            },
          };
        },
      });
    }
  };

  const getLocalTimeHHMMSS = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const resetForm = () => {
    setFormData({
      classId: "",
      sectionIds: "",
      subjectId: "",
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      points: "",
      vacationFiles: [],
      vacationType: "",
    });
    setFilePath([]);
    setSelectedFile([]);
    setIsEditing(false);
    setEditingHomeworkId("");
  };

  const handleModalClose = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setEditingHomeworkId("");
    setFormData({
      classId: "",
      sectionIds: "",
      subjectId: "",
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      points: "",
      vacationFiles: [],
      vacationType: "",
    });
    setFilePath([]);
    setSelectedFile([]);
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!showAddForm) {
      setIsEditing(false);
      setEditingHomeworkId("");
      setFormData({
        classId: "",
        sectionIds: "",
        subjectId: "",
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        points: "",
        vacationFiles: [],
        vacationType: "",
      });
      setFilePath([]);
      setSelectedFile([]);
    }
  }, [showAddForm]);

  const getFileName = (file: string | HomeworkFile): string => {
    if (typeof file === "string") {
      const parts = file.split("/");
      return parts[parts.length - 1] || "";
    }
    return file.fileName;
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View
        style={styles.header}
        className="pt-12 pb-6 px-4 flex-row justify-between items-center"
      >
        <Text className="text-white text-2xl font-bold mb-3">
          Vaccation Homework Manager
        </Text>
        <TouchableOpacity
          style={styles.addHomeworkButton}
          onPress={handleAddNew}
        >
          <Text className="text-white font-semibold text-base">
            + Add Homework
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <FilterSection />

      {/* Homework List */}
      <FlatList
        data={homeworkList}
        renderItem={renderHomeworkItem}
        keyExtractor={(item) => item.vacationId || ""}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-gray-500 text-lg font-medium">
              No homework found
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Add some homework to get started
            </Text>
          </View>
        }
        onEndReached={loadMoreHomeworks}
        onEndReachedThreshold={0.5}
      />

      {/* Add/Edit Homework Modal */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader} className="pt-12 pb-4 px-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-xl font-bold">
                {isEditing ? "Edit Homework" : "Add Homework"}
              </Text>
              <TouchableOpacity
                onPress={handleModalClose}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                <Text className="text-white font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Class Dropdown */}
            <View className="mb-4">
              <Text style={styles.label}>Class *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.classId}
                  onValueChange={(value) => handleInputChange("classId", value)}
                  style={styles.picker}
                  className="text-black"
                >
                  <Picker.Item label="Select Class" value="" />
                  {classesData.map((cls) => (
                    <Picker.Item
                      key={cls.classId}
                      label={cls.className}
                      value={cls.classId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Section Dropdown */}
            <View className="mb-4">
              <Text style={styles.label}>Section *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.sectionIds}
                  onValueChange={(value) =>
                    handleInputChange("sectionIds", value)
                  }
                  style={styles.picker}
                  enabled={!!formData.classId}
                >
                  <Picker.Item label="Select Section" value="" />
                  {filteredSectionsForModal.map((sec) => (
                    <Picker.Item
                      key={sec.sectionId}
                      label={sec.sectionName}
                      value={sec.sectionId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Subject Dropdown */}
            <View className="mb-4">
              <Text style={styles.label}>Subject *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.subjectId}
                  onValueChange={(value) =>
                    handleInputChange("subjectId", value)
                  }
                  style={styles.picker}
                  enabled={!!formData.classId}
                >
                  <Picker.Item label="Select Subject" value="" />
                  {filteredSubjectsForModal.map((sub) => (
                    <Picker.Item
                      key={sub.subjectId}
                      label={sub.subjectName}
                      value={sub.subjectId}
                    />
                  ))}
                </Picker>
              </View>

              {/* Vacation Type */}
              <View className=" mt-4">
                <Text style={styles.label}>Vacation Type *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.vacationType}
                    onValueChange={(value) =>
                      handleInputChange("vacationType", value)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Vacation Type" value="" />
                    <Picker.Item label="Summer Vacation" value="summer" />
                    <Picker.Item label="Winter Vacation" value="winter" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(value) => handleInputChange("title", value)}
                placeholder="Enter homework title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                placeholder="Enter homework description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Due Date and Time */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-800 font-medium">
                    {formatDate(formData.startDate)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text className="text-gray-800 font-medium">
                    {formatDate(formData.endDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Points */}
            <View className="mb-4">
              <Text style={styles.label}>Points *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.points}
                onChangeText={(value) => handleInputChange("points", value)}
                placeholder="Enter points (e.g., 5)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Attachment */}
            <View className="mb-6">
              <Text style={styles.label}>Homework Files</Text>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={pickDocument}
              >
                {formData.vacationFiles.length > 0 ? (
                  <View className="items-center">
                    <Text className="text-gray-500 text-sm mt-1">
                      Tap to change homework files
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Text className="text-gray-600 font-medium text-lg">
                      📎 Select File
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      Optional homework files
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* File Attachments */}
            {isEditing ? (
              <View className="flex-row flex-wrap gap-2 mb-4">
                {filePath.map((file, index) => (
                  <View key={index} className="bg-gray-100 rounded-lg p-2">
                    <Text className="text-gray-500 text-sm">
                      {getFileName(file)}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveFile(file)}>
                      <Text className="text-red-500 text-sm font-medium">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-2 mb-4">
                {filePath.map((file, index) => (
                  <View key={index} className="bg-gray-100 rounded-lg p-2">
                    <Text className="text-gray-500 text-sm">
                      {getFileName(file)}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveFile(file)}>
                      <Text className="text-red-500 text-sm font-medium">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              className="py-4 rounded-lg mb-8"
              onPress={isEditing ? handleUpdate : handleSubmit}
              disabled={
                isEditing
                  ? updateHomeworkLoading
                  : createVacationHomeworkLoading
              }
            >
              <Text className="text-white text-center font-bold text-lg">
                {isEditing
                  ? updateHomeworkLoading
                    ? "Updating..."
                    : "Update Vacation Homework"
                  : createVacationHomeworkLoading
                  ? "Adding..."
                  : "Add Vacation Homework"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Date and Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              timeZoneName="Asia/Kathmandu"
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={formData.endDate}
              mode="date"
              display="default"
              timeZoneName="Asia/Kathmandu"
              onChange={handleEndDateChange}
              is24Hour={false}
            />
          )}
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg mx-4 w-80">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Delete Homework
            </Text>
            <Text className="text-gray-600 mb-6">
              Are you sure you want to delete this homework? This action cannot
              be undone.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-300 py-3 rounded-lg"
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 py-3 rounded-lg"
                onPress={confirmDelete}
                disabled={deleteHomeworkLoading}
              >
                <Text className="text-white text-center font-medium">
                  {deleteHomeworkLoading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 48,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  homeworkCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.6)",
  },
  homeworkTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 26,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    backgroundColor: "#2563EB",
    paddingTop: 48,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    backgroundColor: "white",
    paddingHorizontal: 0,
    paddingVertical: 0,
    // color: "black",
    // overflow: "hidden",
    // paddingHorizontal: Platform.OS === "ios" ? 10 : 0,
  },
  picker: {
    // height: 42,
    // width: "100%",
    // color: "#1F2937",
    // backgroundColor: "white",
  },
  textInput: {
    fontSize: 16,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#0F172A",
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  dateTimeButton: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    marginBottom: 20,
  },
  attachmentButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#F87171",
  },
  pointsBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  attachmentIndicator: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  clearFiltersButton: {
    backgroundColor: "#64748B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: "100%",
  },
  addHomeworkButton: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default VacationHomeworkManager;
