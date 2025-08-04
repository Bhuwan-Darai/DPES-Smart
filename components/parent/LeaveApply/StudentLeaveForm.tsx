import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_LEAVE_NOTE_BY_PARENT,
  GET_LEAVE_NOTES_BY_PARENT,
  GET_STUDENT_DETAILS_BY_PARENT,
  UPDATE_LEAVE_NOTE,
} from "@/lib/hooks/graphql/ParentQueries";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useLeaveDataStore } from "@/lib/zustand/leaveDataStore";

interface Student {
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  studentRollNumber: string;
  studentPhotoUrl: string;
  studentPhotoPath: string;
}

interface LeaveNote {
  leaveNotesId?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  emergencyContact: string;
  studentId: string;
}
export default function StudentLeaveForm() {
  const { showAddForm, setShowAddForm, editLeaveNote, setEditLeaveNote } =
    useLeaveDataStore();
  console.log("editLeaveNote", editLeaveNote);
  const [formData, setFormData] = useState<LeaveNote>({
    studentId: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    emergencyContact: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (editLeaveNote) {
      setFormData({
        studentId: editLeaveNote.studentId,
        leaveType: editLeaveNote.leaveType,
        fromDate: editLeaveNote.fromDate, // fixed: use string directly
        toDate: editLeaveNote.toDate, // fixed: use string directly
        reason: editLeaveNote.reason,
        emergencyContact: editLeaveNote.emergencyContact,
      });
      setFromDate(new Date(editLeaveNote.fromDate));
      setToDate(new Date(editLeaveNote.toDate));
    } else {
      setFormData({
        studentId: "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
        emergencyContact: "",
      });
      setFromDate(null);
      setToDate(null);
    }
  }, [editLeaveNote]);

  // Query to get student details by parent
  const { data, loading, error } = useQuery(GET_STUDENT_DETAILS_BY_PARENT);

  // mutation to create leave note by parent
  const [
    createLeaveNote,
    { loading: createLeaveNoteLoading, error: createLeaveNoteError },
  ] = useMutation(CREATE_LEAVE_NOTE_BY_PARENT);

  const [
    updateLeaveNote,
    { loading: updateLeaveNoteLoading, error: updateLeaveNoteError },
  ] = useMutation(UPDATE_LEAVE_NOTE);

  console.log("error", JSON.stringify(createLeaveNoteError, null, 2));

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.fromDate || !formData.reason) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const dataToSend = {
      leaveNotesId: editLeaveNote?.leaveNotesId || "",
      studentId: formData.studentId,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      leaveType: formData.leaveType,
      reason: formData.reason,
      emergencyContact: formData.emergencyContact,
    };

    console.log("dataToSend to send to backend", dataToSend);

    if (editLeaveNote) {
      await updateLeaveNote({
        variables: {
          updateLeaveNoteInput: dataToSend,
        },
        onCompleted: () => {
          Alert.alert("Success!", "Your leave application has been updated.");
          resetForm();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
        refetchQueries: [GET_LEAVE_NOTES_BY_PARENT],
      });
    } else {
      await createLeaveNote({
        variables: {
          leaveNote: dataToSend,
        },
        onCompleted: () => {
          Alert.alert(
            "Success!",
            "Your leave application has been submitted to your class teacher.",
            [{ text: "OK", onPress: () => resetForm() }]
          );
          resetForm();
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
        refetchQueries: [GET_LEAVE_NOTES_BY_PARENT],
      });
    }
  };

  // Handle date selection
  const handleConfirmDate = (date: Date) => {
    console.log("date from", date);

    setFromDate(date);
    setFormData({
      ...formData,
      fromDate: date.toISOString().split("T")[0],
    });
    setDatePickerVisibility(false);
  };

  const handleConfirmToDate = (date: Date) => {
    console.log("date to", date);
    setToDate(date);
    setFormData({
      ...formData,
      toDate: date.toISOString().split("T")[0],
    });
    setToDatePickerVisibility(false);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);
  const hideToDatePicker = () => setToDatePickerVisibility(false);

  const resetForm = () => {
    setFormData({
      studentId: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      emergencyContact: "",
    });
  };

  const leaveTypes = [
    { id: 1, name: "Sick Leave" },
    { id: 2, name: "Family Emergency" },
    { id: 3, name: "Personal Leave" },
    { id: 4, name: "Other" },
  ];

  return (
    // <ScrollView contentContainerStyle={styles.modal}>
    <View style={styles.card}>
      {/* Close Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
        onPress={() => {
          setShowAddForm(false);
          setEditLeaveNote(null); // reset editLeaveNote when closing
          resetForm();
          setFromDate(null);
          setToDate(null);
        }}
      >
        <Ionicons name="close" size={28} color="#374151" />
      </TouchableOpacity>
      {/* Section Title */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Student Information</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Student</Text>
          <Picker
            selectedValue={formData.studentId}
            onValueChange={(itemValue) => {
              setFormData({
                ...formData,
                studentId: itemValue as string,
              });
            }}
            style={styles.picker}
            dropdownIconColor="#007BFF"
          >
            {loading ? (
              <Picker.Item label="Loading..." value="" />
            ) : (
              (editLeaveNote
                ? data?.getStudentDetailsByParent?.data?.filter(
                    (student: Student) =>
                      student.studentId === editLeaveNote.studentId
                  )
                : data?.getStudentDetailsByParent?.data
              )?.map((student: Student) => (
                <Picker.Item
                  key={student.studentId}
                  label={student.studentName}
                  value={student.studentId}
                />
              ))
            )}
          </Picker>
        </View>
      </View>

      {/* Leave Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Leave Details</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Leave Type</Text>
          <Picker
            selectedValue={formData.leaveType}
            onValueChange={(itemValue) => {
              setFormData({
                ...formData,
                leaveType: itemValue as string,
              });
            }}
            style={styles.picker}
            dropdownIconColor="#007BFF"
          >
            {loading ? (
              <Picker.Item label="Loading..." value="" />
            ) : (
              leaveTypes.map((leaveType) => (
                <Picker.Item
                  key={leaveType.id}
                  label={leaveType.name}
                  value={leaveType.name}
                />
              ))
            )}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>
              From Date <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setDatePickerVisibility(true);
              }}
              style={styles.picker}
            >
              <Text style={styles.pickerText}>
                {fromDate
                  ? moment(fromDate).format("YYYY-MM-DD")
                  : "Select date"}
              </Text>
              <Ionicons name="calendar" size={20} color="#6B7280" />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.flex1}>
            <Text style={styles.label}>
              To Date <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setToDatePickerVisibility(true);
              }}
              style={styles.picker}
            >
              <Text style={styles.pickerText}>
                {toDate ? moment(toDate).format("YYYY-MM-DD") : "Select date"}
              </Text>
              <Ionicons name="calendar" size={20} color="#6B7280" />
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isToDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmToDate}
              onCancel={hideToDatePicker}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Reason for Leave <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={formData.reason}
            onChangeText={(text) => handleChange("reason", text)}
            placeholder="Provide a detailed reason"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[styles.input, { height: 100 }]}
          />
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call-outline" size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            value={formData.emergencyContact}
            onChangeText={(text) => handleChange("emergencyContact", text)}
            placeholder="Emergency contact number"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="send" size={20} color="white" />
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>
    </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  modal: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  card: {
    padding: 16,
    flex: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    minHeight: 400,
    paddingTop: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#111827",
  },
  picker: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    color: "#111827",
  },
  pickerPlaceholder: {
    color: "#9CA3AF",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  requiredNote: {
    marginTop: 12,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  pickerContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
});
