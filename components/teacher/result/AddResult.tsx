import { GET_ACADEMIC_YEARS } from "@/components/calendar/calendar-graphql";
import {
  CREATE_OR_UPDATE_RESULT,
  FIND_RESULT,
  GET_SECTION_LIST,
} from "@/lib/hooks/graphql/TeacherQueries";
import {
  GET_ASSIGNED_CLASSES,
  GET_ASSIGNED_SUBJECTS,
  GET_EXAMS_BY_YEAR,
  GET_FULL_MARKS_FOR_A_SUBJECT,
  GET_STUDENT_LIST_FOR_CLASS_SECTION_WISE,
} from "@/lib/hooks/graphql/TeacherQueries";
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import Toast from "react-native-toast-message";
import Feather from "react-native-vector-icons/Feather";

// Mock subject marks configuration
// Remove subjectMarksConfig and related code
// const subjectMarksConfig = {
//   English: { theoryFullMark: 75, practicalFullMark: 25 },
//   Nepali: { theoryFullMark: 75, practicalFullMark: 25 },
//   Mathematics: { theoryFullMark: 100, practicalFullMark: 0 },
//   Science: { theoryFullMark: 75, practicalFullMark: 25 },
//   "Social Studies": { theoryFullMark: 75, practicalFullMark: 25 },
// };

// Grade calculation functions
const calculateGrade = (obtainedMarks: number, fullMarks: number): string => {
  if (fullMarks === 0) return "";

  const percentage = (obtainedMarks / fullMarks) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  if (percentage >= 40) return "C";
  if (percentage >= 30) return "D";
  return "NG"; // Not Graded/Failed
};

const calculateGradePoint = (
  obtainedMarks: number,
  fullMarks: number
): number => {
  if (fullMarks === 0) return 0;

  const percentage = (obtainedMarks / fullMarks) * 100;

  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.6;
  if (percentage >= 70) return 3.2;
  if (percentage >= 60) return 2.8;
  if (percentage >= 50) return 2.4;
  if (percentage >= 40) return 2.0;
  if (percentage >= 30) return 1.0;
  return 0; // Failed
};

const DropdownSelector = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  isLoading,
  isDisabled,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  const handleOutsidePress = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Determine what text to show in the dropdown
  const getDisplayText = () => {
    if (isLoading) return "Loading...";
    if (isDisabled) return "Not available";
    if (value) return value;
    return placeholder;
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
          color: "#374151",
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => !isDisabled && !isLoading && setIsOpen(!isOpen)}
        style={{
          borderWidth: 1,
          borderColor: error ? "#EF4444" : "#D1D5DB",
          borderRadius: 8,
          padding: 12,
          backgroundColor: isDisabled ? "#F3F4F6" : "#FFFFFF",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: isDisabled ? 0.7 : 1,
        }}
      >
        <Text
          style={{
            color: isLoading
              ? "#6B7280"
              : isDisabled
              ? "#9CA3AF"
              : value
              ? "#1F2937"
              : "#9CA3AF",
            flex: 1,
          }}
        >
          {getDisplayText()}
        </Text>
        <Text style={{ color: "#6B7280" }}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {error && (
        <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
      {isOpen && !isLoading && !isDisabled && (
        <View
          style={{
            position: "absolute",
            top: 70,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            maxHeight: 300,
            zIndex: 1000,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            overflow: "hidden",
          }}
        >
          <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            bounces={false}
            contentContainerStyle={{
              flexGrow: 0,
            }}
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    padding: 12,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    borderBottomColor: "#F3F4F6",
                    backgroundColor: value === option ? "#F3F4F6" : "#FFFFFF",
                    minHeight: 44,
                  }}
                >
                  <Text
                    style={{
                      color: value === option ? "#3B82F6" : "#1F2937",
                      fontWeight: value === option ? "600" : "normal",
                      fontSize: 14,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ padding: 12, alignItems: "center" }}>
                <Text style={{ color: "#6B7280" }}>No options available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const MarksInputRow = ({
  student,
  result,
  onUpdateMarks,
  subjectMarks,
  isEditing,
}: {
  student: { rollNumber: number; name: string; studentId: string };
  result: any;
  onUpdateMarks: (studentId: string, marks: any) => void;
  subjectMarks: any;
  isEditing: boolean;
}) => {
  // Guard: if subjectMarks is undefined, do not render
  if (!subjectMarks) return null;

  // Use result values for controlled inputs
  const [theoryMarks, setTheoryMarks] = useState<string>(
    result?.theoryObtainMark?.toString() || ""
  );
  const [practicalMarks, setPracticalMarks] = useState<string>(
    result?.practicalObtainMark?.toString() || ""
  );
  // const [remarks, setRemarks] = useState<string>(result?.remarks || "");

  useEffect(() => {
    setTheoryMarks(result?.theoryObtainMark?.toString() || "");
    setPracticalMarks(result?.practicalObtainMark?.toString() || "");
    // setRemarks(result?.remarks || "");
  }, [result]);

  // Calculate values based on inputs
  const theoryObtainMark = theoryMarks === "" ? 0 : parseInt(theoryMarks);
  const practicalObtainMark =
    practicalMarks === "" ? 0 : parseInt(practicalMarks);
  const totalMark = theoryObtainMark + practicalObtainMark;

  const theoryGrade = calculateGrade(
    theoryObtainMark,
    subjectMarks.theoryFullMark
  );
  const practicalGrade =
    subjectMarks.practicalFullMark > 0
      ? calculateGrade(practicalObtainMark, subjectMarks.practicalFullMark)
      : "";

  // If either theory or practical is NG (grade point 0), total grade should be NG
  const theoryGradePoint = calculateGradePoint(
    theoryObtainMark,
    subjectMarks.theoryFullMark
  );
  const practicalGradePoint =
    subjectMarks.practicalFullMark > 0
      ? calculateGradePoint(practicalObtainMark, subjectMarks.practicalFullMark)
      : 0;

  let totalGrade = "NG";
  let totalGradePoint = 0;

  // Total grade is only calculated if both components are passed
  if (
    (subjectMarks.practicalFullMark === 0 || practicalGradePoint > 0) &&
    theoryGradePoint > 0
  ) {
    totalGrade = calculateGrade(
      totalMark,
      subjectMarks.theoryFullMark + subjectMarks.practicalFullMark
    );
    totalGradePoint = calculateGradePoint(
      totalMark,
      subjectMarks.theoryFullMark + subjectMarks.practicalFullMark
    );
  }

  // Update parent with all calculated values
  React.useEffect(() => {
    onUpdateMarks(student.studentId, {
      studentId: student.studentId,
      theoryObtainMark,
      practicalObtainMark,
      totalMark,
      theoryGrade,
      practicalGrade,
      totalGrade,
      theoryGradePoint,
      practicalGradePoint,
      totalGradePoint,
      // remarks,
    });
  }, [theoryObtainMark, practicalObtainMark]);

  const handleTheoryChange = (value: string) => {
    // Validate if marks exceed the maximum
    if (value !== "" && parseInt(value) > subjectMarks.theoryFullMark) {
      Toast.show({
        type: "error",
        text1: `Theory marks cannot exceed ${subjectMarks.theoryFullMark}`,
      });
      return;
    }
    setTheoryMarks(value);
  };

  const handlePracticalChange = (value: string) => {
    // For subjects without practicals
    if (subjectMarks.practicalFullMark === 0) {
      Toast.show({
        type: "error",
        text1: "This subject does not have a practical component",
      });
      return;
    }

    // Validate if marks exceed the maximum
    if (value !== "" && parseInt(value) > subjectMarks.practicalFullMark) {
      Toast.show({
        type: "error",
        text1: `Practical marks cannot exceed ${subjectMarks.practicalFullMark}`,
      });
      return;
    }
    setPracticalMarks(value);
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", fontSize: 16, color: "#1F2937" }}>
            Roll: {student.rollNumber}
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 14 }}>{student.name}</Text>
        </View>
      </View>

      {/* Vertical layout for input fields */}
      <View style={{ gap: 16 }}>
        {/* Theory Section */}
        <View>
          <Text
            style={{ fontWeight: "600", marginBottom: 8, color: "#374151" }}
          >
            Theory ({subjectMarks.theoryFullMark} Marks)
          </Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Enter Marks"
                  value={theoryMarks}
                  onChangeText={isEditing ? handleTheoryChange : undefined}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 6,
                    padding: 8,
                    fontSize: 14,
                    backgroundColor: isEditing ? "#FFFFFF" : "#F3F4F6",
                  }}
                  keyboardType="numeric"
                  editable={isEditing}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Grade"
                  value={theoryGrade}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 6,
                    padding: 8,
                    fontSize: 14,
                    backgroundColor: "#F9FAFB",
                    color: theoryGrade === "NG" ? "#EF4444" : "#1F2937",
                    fontWeight: "500",
                  }}
                />
              </View>
            </View>
            <TextInput
              placeholder="Grade Point"
              value={theoryGradePoint.toString()}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
                backgroundColor: "#F9FAFB",
                color: theoryGradePoint === 0 ? "#EF4444" : "#1F2937",
                fontWeight: "500",
              }}
            />
          </View>
        </View>

        {/* Practical Section */}
        {subjectMarks.practicalFullMark > 0 && (
          <View>
            <Text
              style={{ fontWeight: "600", marginBottom: 8, color: "#374151" }}
            >
              Practical ({subjectMarks.practicalFullMark} Marks)
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Enter Marks"
                    value={practicalMarks}
                    onChangeText={isEditing ? handlePracticalChange : undefined}
                    style={{
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      borderRadius: 6,
                      padding: 8,
                      fontSize: 14,
                      backgroundColor: isEditing ? "#FFFFFF" : "#F3F4F6",
                    }}
                    keyboardType="numeric"
                    editable={isEditing}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Grade"
                    value={practicalGrade}
                    editable={false}
                    style={{
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      borderRadius: 6,
                      padding: 8,
                      fontSize: 14,
                      backgroundColor: "#F9FAFB",
                      color: practicalGrade === "NG" ? "#EF4444" : "#1F2937",
                      fontWeight: "500",
                    }}
                  />
                </View>
              </View>
              <TextInput
                placeholder="Grade Point"
                value={practicalGradePoint.toString()}
                editable={false}
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 6,
                  padding: 8,
                  fontSize: 14,
                  backgroundColor: "#F9FAFB",
                  color: practicalGradePoint === 0 ? "#EF4444" : "#1F2937",
                  fontWeight: "500",
                }}
              />
            </View>
          </View>
        )}

        {/* Total Section */}
        <View>
          <Text
            style={{ fontWeight: "600", marginBottom: 8, color: "#374151" }}
          >
            Total (
            {subjectMarks.theoryFullMark + subjectMarks.practicalFullMark}{" "}
            Marks)
          </Text>
          <View style={{ gap: 8 }}>
            <TextInput
              placeholder="Total Marks"
              value={totalMark.toString()}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 6,
                padding: 8,
                fontSize: 14,
                backgroundColor: "#F9FAFB",
                fontWeight: "500",
              }}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Grade"
                  value={totalGrade}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 6,
                    padding: 8,
                    fontSize: 14,
                    backgroundColor: "#F9FAFB",
                    color: totalGrade === "NG" ? "#EF4444" : "#1F2937",
                    fontWeight: "500",
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Grade Point"
                  value={totalGradePoint.toString()}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 6,
                    padding: 8,
                    fontSize: 14,
                    backgroundColor: "#F9FAFB",
                    color: totalGradePoint === 0 ? "#EF4444" : "#1F2937",
                    fontWeight: "500",
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Remarks */}
        {/* <View>
          <Text
            style={{ fontWeight: "600", marginBottom: 8, color: "#374151" }}
          >
            Remarks
          </Text>
          <TextInput
            placeholder="Enter remarks"
            value={remarks}
            onChangeText={isEditing ? setRemarks : undefined}
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 6,
              padding: 8,
              fontSize: 14,
              height: 80,
              backgroundColor: isEditing ? "#FFFFFF" : "#F3F4F6",
            }}
            multiline
            textAlignVertical="top"
            editable={isEditing}
          /> */}
        {/* </View> */}
      </View>
    </View>
  );
};

// Add this loading card component
const LoadingCard = () => (
  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    <View style={{ flexDirection: "row", marginBottom: 16 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#E5E7EB",
            height: 20,
            width: 100,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            backgroundColor: "#E5E7EB",
            height: 16,
            width: 150,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
    <View style={{ gap: 16 }}>
      {/* Theory Section Loading */}
      <View>
        <View
          style={{
            backgroundColor: "#E5E7EB",
            height: 16,
            width: 120,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
          </View>
          <View
            style={{ backgroundColor: "#E5E7EB", height: 40, borderRadius: 6 }}
          />
        </View>
      </View>
      {/* Practical Section Loading */}
      <View>
        <View
          style={{
            backgroundColor: "#E5E7EB",
            height: 16,
            width: 140,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
          </View>
          <View
            style={{ backgroundColor: "#E5E7EB", height: 40, borderRadius: 6 }}
          />
        </View>
      </View>
      {/* Total Section Loading */}
      <View>
        <View
          style={{
            backgroundColor: "#E5E7EB",
            height: 16,
            width: 100,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <View style={{ gap: 8 }}>
          <View
            style={{ backgroundColor: "#E5E7EB", height: 40, borderRadius: 6 }}
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                height: 40,
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  </View>
);

interface AcademicYear {
  academicYearId: string;
  academicYear: string;
}

interface Class {
  classId: string;
  className: string;
}

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  studentClass: {
    className: string;
  };
  studentSection: {
    sectionName: string;
  };
}

interface Exams {
  examId: string;
  examName: string;
}

interface Section {
  sectionId: string;
  sectionName: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
}

// Add Result type if not already defined
interface Result {
  studentId: string;
  theoryObtainMark: number;
  practicalObtainMark: number;
  totalMark: number;
  theoryGrade: string;
  practicalGrade: string;
  totalGrade: string;
  theoryGradePoint: number;
  practicalGradePoint: number;
  totalGradePoint: number;
  // remarks: string;
}

export default function AddResult() {
  const [results, setResults] = useState<any[]>([]);
  const [createOrUpdateResultLoading, setCreateOrUpdateResultLoading] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingResultsLoading, setExistingResultsLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [academicYearsLoading, setAcademicYearsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubjectLoading, setIsSubjectLoading] = useState(true);
  // get academic years
  const { data: academicYearsData, loading: isAcademicYearsLoading } =
    useQuery(GET_ACADEMIC_YEARS);

  // set academic years
  useEffect(() => {
    if (academicYearsData?.getAcademicYears) {
      setAcademicYears(academicYearsData.getAcademicYears.data);
      setAcademicYearsLoading(isAcademicYearsLoading);
      setSelectedYear(
        academicYearsData.getAcademicYears.data[0].academicYearId
      );
    }
  }, [academicYearsData]);

  // Get exams for the selected year
  const [exams, setExams] = useState<Exams[]>([]);
  const [isExamLoading, setIsExamLoading] = useState(false);
  const { data: examsData, loading: examLoading } = useQuery(
    GET_EXAMS_BY_YEAR,
    {
      variables: { year: selectedYear },
      skip: !selectedYear,
    }
  );

  useEffect(() => {
    if (examsData?.findExamsByYear?.exams) {
      setExams(examsData.findExamsByYear.exams);
      setIsExamLoading(examLoading);
    }
  }, [examsData, examLoading]);

  // Get classes for the selected exam
  const [classes, setClasses] = useState<Class[]>([]);
  const [isClassLoading, setIsClassLoading] = useState(true);
  const {
    data: classesData,
    loading: classLoading,
    error: classError,
  } = useQuery(GET_ASSIGNED_CLASSES, {
    variables: { examId: selectedExam },
    skip: !selectedExam,
  });

  console.log("classesData", JSON.stringify(classesData, null, 2));
  console.log("classError", JSON.stringify(classError, null, 2));

  useEffect(() => {
    if (classesData?.getAssignedClasses?.classes) {
      setClasses(classesData.getAssignedClasses.classes);
      setIsClassLoading(classLoading);
    }
  }, [classesData, classLoading]);

  // Get subjects for the selected class
  const {
    data: subjectsData,
    loading: subjectLoading,
    error: subjectError,
  } = useQuery(GET_ASSIGNED_SUBJECTS, {
    variables: { examId: selectedExam, classId: selectedClass },
    skip: !selectedExam || !selectedClass,
  });

  useEffect(() => {
    if (subjectsData?.getAssignedSubjects?.subjects) {
      setSubjects(subjectsData.getAssignedSubjects.subjects);
      setIsSubjectLoading(subjectLoading);
    }
  }, [subjectsData, subjectLoading]);

  console.log("subjectsData", JSON.stringify(subjectsData, null, 2));
  console.log("subjectError", JSON.stringify(subjectError, null, 2));

  // Get sections for the selected class
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [isSectionLoading, setIsSectionLoading] = useState(true);
  const {
    data: sectionsData,
    loading: sectionLoading,
    error: sectionError,
  } = useQuery(GET_SECTION_LIST, {
    variables: { classId: selectedClass },
    skip: !selectedClass,
  });

  console.log("sectionsData", JSON.stringify(sectionsData, null, 2));
  console.log("sectionError", JSON.stringify(sectionError, null, 2));

  useEffect(() => {
    if (sectionsData?.sectionsByClassId) {
      setSections(sectionsData.sectionsByClassId);
      setIsSectionLoading(sectionLoading);
    }
  }, [sectionsData, sectionLoading]);

  // Get students for the selected class and section
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const {
    data: studentsData,
    loading: studentLoading,
    error: studentError,
  } = useQuery(GET_STUDENT_LIST_FOR_CLASS_SECTION_WISE, {
    variables: {
      searchQuery: "",
      filters: {
        class: selectedClass,
        section: selectedSection,
        subject: selectedSubject,
      },
    },
    skip: !selectedClass || !selectedSection || !selectedSubject,
  });

  console.log("studentsData", JSON.stringify(studentsData, null, 2));
  console.log("studentError", JSON.stringify(studentError, null, 2));

  useEffect(() => {
    if (studentsData?.GetStudentListForClassSectionWise?.students) {
      const students = studentsData.GetStudentListForClassSectionWise.students;
      // Sort students by roll number
      const sortedStudents = [...students].sort((a, b) => {
        return Number(a.rollNumber ?? 0) - Number(b.rollNumber ?? 0);
      });

      // Initialize results array with student data
      const initialResults = sortedStudents.map((student: Student) => ({
        studentId: student.studentId,
        theoryObtainMark: 0,
        practicalObtainMark: 0,
        totalMark: 0,
        theoryGrade: "",
        practicalGrade: "",
        totalGrade: "",
        theoryGradePoint: 0,
        practicalGradePoint: 0,
        totalGradePoint: 0,
        // remarks: "",
      }));
      setResults(initialResults);
      setStudents(sortedStudents);
      setStudentsLoading(studentLoading);
    }
  }, [studentsData, studentLoading]);

  // Add the FIND_RESULT query for fetching existing results
  const {
    data: existingResultsData,
    loading: existingResultLoad,
    error: existingResultError,
  } = useQuery(FIND_RESULT, {
    variables: {
      input: {
        examId: selectedExam,
        classId: selectedClass,
        sectionId: selectedSection,
        subjectId: selectedSubject,
      },
    },
    skip:
      !selectedExam || !selectedClass || !selectedSection || !selectedSubject,
  });

  console.log(
    "existingResultsData",
    JSON.stringify(existingResultsData, null, 2)
  );

  console.log(
    "existingResultError",
    JSON.stringify(existingResultError, null, 2)
  );

  // Update results when existing results are found
  useEffect(() => {
    if (existingResultsData?.findResult?.results && students.length > 0) {
      // Merge: for each student, use their result if it exists, else blank/default
      const existingResults = existingResultsData.findResult.results;
      const mergedResults = students.map((student) => {
        const found = existingResults.find(
          (r: Result) => r.studentId === student.studentId
        );
        return (
          found || {
            studentId: student.studentId,
            theoryObtainMark: 0,
            practicalObtainMark: 0,
            totalMark: 0,
            theoryGrade: "",
            practicalGrade: "",
            totalGrade: "",
            theoryGradePoint: 0,
            practicalGradePoint: 0,
            totalGradePoint: 0,
            // remarks: "",
          }
        );
      });
      setResults(mergedResults);
      setExistingResultsLoading(existingResultLoad);
    }
  }, [existingResultsData, students]);

  // Get full marks for the selected subject
  const [marksLoading, setMarksLoading] = useState(true);
  const [marks, setMarks] = useState([]);
  const { data: marksData, loading: markLoading } = useQuery(
    GET_FULL_MARKS_FOR_A_SUBJECT,
    {
      variables: {
        examId: selectedExam,
        classId: selectedClass,
        subjectId: selectedSubject,
      },
      skip: !selectedExam || !selectedClass || !selectedSubject,
    }
  );

  console.log("marksData", JSON.stringify(marksData, null, 2));

  useEffect(() => {
    if (marksData) {
      setMarks(marksData.getFullMarksForASubject.marks);
      setMarksLoading(markLoading);
    }
  }, [marksData, markLoading]);

  const [createOrUpdateResult] = useMutation(CREATE_OR_UPDATE_RESULT, {
    refetchQueries: [FIND_RESULT],
  });

  const updateStudentMarks = (studentId: string, marks: any) => {
    setResults((prevResults) => {
      const resultIndex = prevResults.findIndex(
        (r) => r.studentId === studentId
      );

      if (resultIndex === -1) {
        return [...prevResults, marks];
      } else {
        const newResults = [...prevResults];
        newResults[resultIndex] = marks;
        return newResults;
      }
    });
  };

  const allFiltersSelected =
    selectedYear !== "" &&
    selectedExam !== "" &&
    selectedClass !== "" &&
    selectedSection !== "" &&
    selectedSubject !== "";

  const subjectMarks = marksData?.getFullMarksForASubject?.marks;

  const handleSave = async () => {
    if (
      !selectedExam ||
      !selectedClass ||
      !selectedSection ||
      !selectedSubject
    ) {
      Alert.alert("Please select all required fields");
      return;
    }

    if (results.length === 0) {
      Alert.alert("Please add results");
      return;
    }

    if (!subjectMarks) {
      Alert.alert("Subject marks not loaded");
      return;
    }

    if (
      results.some((result) => {
        if (!subjectMarks) return true; // If config missing, treat as incomplete
        if (subjectMarks.practicalFullMark > 0) {
          return (
            result.theoryObtainMark === 0 && result.practicalObtainMark === 0
          );
        }
        return result.theoryObtainMark === 0;
      })
    ) {
      Alert.alert("Please fill marks for all students");
      return;
    }

    // Check for marks exceeding full marks
    if (
      results.some((result) => {
        if (!subjectMarks) return false;
        return (
          result.theoryObtainMark > subjectMarks.theoryFullMark ||
          result.practicalObtainMark > subjectMarks.practicalFullMark
        );
      })
    ) {
      Alert.alert("Some marks exceed the full marks allowed");
      return;
    }

    try {
      setCreateOrUpdateResultLoading(true);
      await createOrUpdateResult({
        variables: {
          input: {
            examId: selectedExam,
            classId: selectedClass,
            sectionId: selectedSection,
            subjectId: selectedSubject,
            results: results.map((result) => ({
              studentId: result.studentId,
              subjectId: selectedSubject,
              theoryObtainMark: result.theoryObtainMark,
              practicalObtainMark: result.practicalObtainMark,
              totalObtainMark: result.totalMark,
              theoryGrade: result.theoryGrade,
              practicalGrade: result.practicalGrade,
              totalGrade: result.totalGrade,
              theoryGradePoint: result.theoryGradePoint,
              practicalGradePoint: result.practicalGradePoint,
              totalGradePoint: result.totalGradePoint,
              // remarks: result.remarks,
            })),
          },
        },
        onCompleted: (data) => {
          Alert.alert(data.createOrUpdateResult.message || "Results saved!");
        },
        onError: (error) => {
          Alert.alert(error.message || "Failed to save results");
          console.error(error);
        },
      });
    } catch (error) {
      Alert.alert("Failed to save results");
      console.error(error);
    } finally {
      setCreateOrUpdateResultLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Toast />
      <View style={{ padding: 4 }}>
        {/* Filter Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            zIndex: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 20,
              color: "#1F2937",
            }}
          >
            Select Filters
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View style={{ flex: 1, minWidth: 150 }}>
              <DropdownSelector
                label="Select Year"
                value={
                  academicYears.find(
                    (year) => year.academicYearId === selectedYear
                  )?.academicYear || ""
                }
                options={academicYears.map((year) => year.academicYear)}
                onSelect={(value) => {
                  const found = academicYears.find(
                    (year) => year.academicYear === value
                  );
                  setSelectedYear(found?.academicYearId || "");
                  // Reset dependent fields
                  setSelectedExam("");
                  setSelectedClass("");
                  setSelectedSection("");
                  setSelectedSubject("");
                }}
                placeholder="Select year"
                isLoading={academicYearsLoading}
              />
            </View>
            <View style={{ flex: 1, minWidth: 150 }}>
              <DropdownSelector
                label="Select Exam"
                value={
                  exams.find((exam) => exam.examId === selectedExam)
                    ?.examName || ""
                }
                options={exams.map((exam) => exam.examName)}
                onSelect={(value) => {
                  const found = exams.find((exam) => exam.examName === value);
                  setSelectedExam(found?.examId || "");
                  // Reset dependent fields
                  setSelectedClass("");
                  setSelectedSection("");
                  setSelectedSubject("");
                }}
                placeholder="Select exam"
                isLoading={isExamLoading}
                isDisabled={!selectedYear || exams.length === 0}
                error={!selectedYear ? "Please select year first" : undefined}
              />
            </View>
            <View style={{ flex: 1, minWidth: 150 }}>
              <DropdownSelector
                label="Select Class"
                value={
                  classes.find(
                    (classItem) => classItem.classId === selectedClass
                  )?.className || ""
                }
                options={classes.map((classItem) => classItem.className)}
                onSelect={(value) => {
                  const found = classes.find(
                    (classItem) => classItem.className === value
                  );
                  setSelectedClass(found?.classId || "");
                  // Reset dependent fields
                  setSelectedSection("");
                  setSelectedSubject("");
                }}
                placeholder="Select class"
                isLoading={isClassLoading}
                isDisabled={!selectedExam || classes.length === 0}
                error={
                  classError?.message ||
                  (!selectedExam ? "Please select exam first" : undefined)
                }
              />
            </View>
            <View style={{ flex: 1, minWidth: 150 }}>
              <DropdownSelector
                label="Select Section"
                value={
                  sections.find(
                    (section) => section.sectionId === selectedSection
                  )?.sectionName || ""
                }
                options={sections.map((section) => section.sectionName)}
                onSelect={(value) => {
                  const found = sections.find(
                    (section) => section.sectionName === value
                  );
                  setSelectedSection(found?.sectionId || "");
                  setSelectedSubject("");
                }}
                placeholder="Select section"
                isLoading={isSectionLoading}
                isDisabled={!selectedClass || sections.length === 0}
                error={
                  sectionError?.message ||
                  (!selectedClass ? "Please select class first" : undefined)
                }
              />
            </View>
            <View style={{ flex: 1, minWidth: 150 }}>
              <DropdownSelector
                label="Select Subject"
                value={
                  subjects.find(
                    (subject) => subject.subjectId === selectedSubject
                  )?.subjectName || ""
                }
                options={subjects.map((subject) => subject.subjectName)}
                onSelect={(value) => {
                  const found = subjects.find(
                    (subject) => subject.subjectName === value
                  );
                  setSelectedSubject(found?.subjectId || "");
                }}
                placeholder="Select subject"
                isLoading={isSubjectLoading}
                isDisabled={!selectedSection || subjects.length === 0}
                error={
                  subjectError?.message ||
                  (!selectedSection ? "Please select section first" : undefined)
                }
              />
            </View>
          </View>
        </View>

        {/* Student Marks Entry Section */}
        {allFiltersSelected && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 20,
                color: "#1F2937",
              }}
            >
              Student Marks Entry
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginBottom: 20,
              }}
            >
              {classes.find((c) => c.classId === selectedClass)?.className ||
                selectedClass}{" "}
              - Section{" "}
              {sections.find((s) => s.sectionId === selectedSection)
                ?.sectionName || selectedSection}{" "}
              |{" "}
              {subjects.find((s) => s.subjectId === selectedSubject)
                ?.subjectName || selectedSubject}{" "}
              |{" "}
              {exams.find((e) => e.examId === selectedExam)?.examName ||
                selectedExam}
            </Text>

            {/* Edit/Save Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              {isEditing ? (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={createOrUpdateResultLoading}
                  style={{
                    backgroundColor: createOrUpdateResultLoading
                      ? "#9CA3AF"
                      : "#3B82F6",
                    borderRadius: 12,
                    padding: 12,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: "600",
                      marginRight: 8,
                    }}
                  >
                    {createOrUpdateResultLoading ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={{
                    backgroundColor: "#E5E7EB",
                    borderRadius: 12,
                    padding: 12,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Feather
                    name="edit-2"
                    size={18}
                    color="#1F2937"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#1F2937",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Edit Results
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Show loading cards or content */}
            {studentsLoading || marksLoading || existingResultsLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : students.length === 0 ? (
              <View style={{ padding: 16, alignItems: "center" }}>
                <Text style={{ color: "#6B7280", fontSize: 16 }}>
                  No students found for the selected criteria
                </Text>
              </View>
            ) : !subjectMarks ? (
              <View style={{ padding: 16, alignItems: "center" }}>
                <Text style={{ color: "#EF4444", fontSize: 16 }}>
                  Subject marks configuration not loaded
                </Text>
              </View>
            ) : (
              students.map((student) => {
                const result =
                  results.find((r) => r.studentId === student.studentId) || {};
                return (
                  <MarksInputRow
                    key={student.studentId}
                    student={{
                      rollNumber: Number(student.rollNumber),
                      name: `${student.firstName} ${student.lastName}`.trim(),
                      studentId: student.studentId,
                    }}
                    result={result}
                    onUpdateMarks={updateStudentMarks}
                    subjectMarks={subjectMarks}
                    isEditing={isEditing}
                  />
                );
              })
            )}
          </View>
        )}

        {!allFiltersSelected && (
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              zIndex: -1,
            }}
          >
            <Text
              style={{
                color: "#92400E",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Please select all filters to view student marks entry form
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
