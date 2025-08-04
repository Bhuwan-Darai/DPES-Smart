// App.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  KeyboardTypeOptions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface FormData {
  parentName: string;
  studentName: string;
  studentClass: string;
  contactNumber: string;
  email: string;
  complaintType: string;
  subject: string;
  description: string;
  priority: string;
}

interface FormErrors {
  parentName?: string;
  studentName?: string;
  studentClass?: string;
  contactNumber?: string;
  email?: string;
  complaintType?: string;
  subject?: string;
  description?: string;
  priority?: string;
}

const ParentComplaintApp = () => {
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    studentName: "",
    studentClass: "",
    contactNumber: "",
    email: "",
    complaintType: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const complaintTypes = [
    "Academic Issues",
    "Bullying/Harassment",
    "Teacher Behavior",
    "Infrastructure/Facilities",
    "Transportation",
    "Food/Cafeteria",
    "Administrative Issues",
    "Safety Concerns",
    "Other",
  ];

  const priorities = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    }

    if (!formData.studentClass.trim()) {
      newErrors.studentClass = "Student class is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ""))) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.complaintType) {
      newErrors.complaintType = "Please select a complaint type";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        "Complaint Submitted",
        "Your complaint has been submitted successfully. We will review it and get back to you within 2-3 business days.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                parentName: "",
                studentName: "",
                studentClass: "",
                contactNumber: "",
                email: "",
                complaintType: "",
                subject: "",
                description: "",
                priority: "medium",
              });
              setErrors({});
            },
          },
        ]
      );
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    multiline: boolean = false,
    keyboardType: KeyboardTypeOptions = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        autoCapitalize={field === "email" ? "none" : "sentences"}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Submit Complaint</Text>
            <Text style={styles.headerSubtitle}>
              We value your feedback and will address your concerns promptly
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Parent Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Parent Information</Text>
              {renderInput("parentName", "Parent/Guardian Name")}
              {renderInput(
                "contactNumber",
                "Contact Number",
                false,
                "phone-pad"
              )}
              {renderInput("email", "Email Address", false, "email-address")}
            </View>

            {/* Student Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Information</Text>
              {renderInput("studentName", "Student Name")}
              {renderInput("studentClass", "Class/Grade")}
            </View>

            {/* Complaint Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Complaint Details</Text>

              {/* Complaint Type */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Complaint Type</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    errors.complaintType && styles.inputError,
                  ]}
                >
                  <Picker
                    selectedValue={formData.complaintType}
                    onValueChange={(value) =>
                      updateFormData("complaintType", value)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select complaint type..." value="" />
                    {complaintTypes.map((type, index) => (
                      <Picker.Item key={index} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
                {errors.complaintType && (
                  <Text style={styles.errorText}>{errors.complaintType}</Text>
                )}
              </View>

              {/* Priority */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Priority Level</Text>
                <View style={styles.priorityContainer}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority.value &&
                          styles.priorityButtonActive,
                        priority.value === "urgent" &&
                          formData.priority === priority.value &&
                          styles.priorityUrgent,
                        priority.value === "high" &&
                          formData.priority === priority.value &&
                          styles.priorityHigh,
                        priority.value === "medium" &&
                          formData.priority === priority.value &&
                          styles.priorityMedium,
                        priority.value === "low" &&
                          formData.priority === priority.value &&
                          styles.priorityLow,
                      ]}
                      onPress={() => updateFormData("priority", priority.value)}
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          formData.priority === priority.value &&
                            styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {renderInput("subject", "Subject/Title")}
              {renderInput("description", "Detailed Description", true)}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            </TouchableOpacity>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>
                Need immediate assistance?
              </Text>
              <Text style={styles.contactText}>
                📞 Emergency: +1-234-567-8900
              </Text>
              <Text style={styles.contactText}>
                📧 Email: complaints@school.edu
              </Text>
              <Text style={styles.contactText}>
                🕒 Office Hours: Mon-Fri 8:00 AM - 5:00 PM
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1F2937",
    padding: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 24,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#1F2937",
  },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    minWidth: 70,
    alignItems: "center",
  },
  priorityButtonActive: {
    borderColor: "#3B82F6",
  },
  priorityUrgent: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  priorityHigh: {
    backgroundColor: "#FED7AA",
    borderColor: "#F97316",
  },
  priorityMedium: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  priorityLow: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  priorityButtonTextActive: {
    color: "#1F2937",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  contactInfo: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ParentComplaintApp;

// package.json dependencies needed:
/*
{
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-native-picker/picker": "2.4.10"
  }
}
*/

// Installation command:
// npm install @react-native-picker/picker
