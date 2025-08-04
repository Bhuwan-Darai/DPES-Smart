import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Stack, router } from "expo-router";
import { ChevronLeft, FilterIcon, XIcon } from "lucide-react-native";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useAttendanceDateStore,
  AttendanceDateState,
  useTeacherAttendanceDateStore,
} from "../../lib/zustand/attendanceDateStore";

const AttendanceHeader = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = useAttendanceDateStore(
    (state: AttendanceDateState) => state.selectedDate
  );
  const setSelectedDate = useAttendanceDateStore(
    (state: AttendanceDateState) => state.setSelectedDate
  );

  // handle clear date
  const handleClearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Take Attendance</Text>
          <Text style={styles.headerSubtitle}>Class 10A • Today</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
        >
          <FilterIcon size={20} color="#fff" />{" "}
          <Text style={styles.filterText}>
            {" "}
            {selectedDate ? selectedDate.toDateString() : "Select Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButtonClear}
          activeOpacity={0.7}
          onPress={handleClearDate}
        >
          <XIcon size={20} color="#fff" />
        </TouchableOpacity>
        {showDatePicker && (
          <RNDateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (event.type === "set") {
                setSelectedDate(date || new Date());
              }
              setShowDatePicker(false); // Always close picker
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const TeacherAttendanceHeader = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedDate = useTeacherAttendanceDateStore(
    (state: AttendanceDateState) => state.selectedDate
  );
  const setSelectedDate = useTeacherAttendanceDateStore(
    (state: AttendanceDateState) => state.setSelectedDate
  );

  // handle clear date
  const handleClearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Teacher Attendance</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(true)}
          >
            <FilterIcon size={20} color="#fff" />{" "}
            <Text style={styles.filterText}>
              {selectedDate ? selectedDate.toDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButtonClear}
            activeOpacity={0.7}
            onPress={handleClearDate}
          >
            <XIcon size={20} color="#fff" />
          </TouchableOpacity>
          {showDatePicker && (
            <RNDateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                if (event.type === "set") {
                  setSelectedDate(date || new Date());
                }
                setShowDatePicker(false); // Always close picker
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const TimeTableHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Time Table</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const AssignmentHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Assignment</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const SettingsHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const MakeAttendanceHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Make Attendance</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const AddResultHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Result Entry System</Text>
          <Text style={styles.headerSubtitle}>
            Enter student marks and grades
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ResultLedgerHeader = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Result Ledger</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function MainScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ai"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 16,
                }}
              >
                AI Courses
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="attendance"
        options={{
          headerShown: true,
          header: () => <AttendanceHeader />,
        }}
      />
      <Stack.Screen
        name="rofile"
        options={{ headerShown: true, headerTitle: "Profile" }}
      />
      <Stack.Screen
        name="calendar"
        options={{ headerShown: true, headerTitle: "Calendar" }}
      />
      <Stack.Screen
        name="examRoutine"
        options={{ headerShown: true, headerTitle: "Exam Routine" }}
      />
      <Stack.Screen
        name="curriculum"
        options={{ headerShown: true, headerTitle: "Manage Lesson Plan" }}
      />
      <Stack.Screen
        name="teacherAttendance"
        options={{
          headerShown: true,
          header: () => <TeacherAttendanceHeader />,
        }}
      />
      <Stack.Screen
        name="timeTable"
        options={{
          headerShown: true,
          header: () => <TimeTableHeader />,
        }}
      />
      <Stack.Screen
        name="makeAttendance"
        options={{
          headerShown: true,
          header: () => <MakeAttendanceHeader />,
        }}
      />
      <Stack.Screen
        name="assignment"
        options={{
          headerShown: true,
          header: () => <AssignmentHeader />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          header: () => <SettingsHeader />,
        }}
      />
      <Stack.Screen
        name="addResult"
        options={{
          headerShown: true,
          header: () => <AddResultHeader />,
        }}
      />
      <Stack.Screen
        name="resultLedger"
        options={{
          headerShown: true,
          header: () => <ResultLedgerHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#007AFF",
  },
  headerContainer: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  iconButtonClear: {
    borderRadius: 2,
    backgroundColor: "rgba(123, 45, 67, 0.8)",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
