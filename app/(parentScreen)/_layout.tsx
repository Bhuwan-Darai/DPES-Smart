import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LeaveDataState } from "@/lib/zustand/leaveDataStore";
import { useLeaveDataStore } from "@/lib/zustand/leaveDataStore";

const ExamRoutineHeader = () => {
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
          <Text style={styles.headerTitle}>Exam Routine</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ResultHeader = () => {
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

const HomeworkHeader = () => {
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
          <Text style={styles.headerTitle}>Homework</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const AIHomeworkHeader = () => {
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
          <Text style={styles.headerTitle}>AI Homework</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ClassRoutineHeader = () => {
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
          <Text style={styles.headerTitle}>Class Routine</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const VaccationHomeWorkHeader = () => {
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
          <Text style={styles.headerTitle}>Vaccation Home Work</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const HelpHeader = () => {
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
          <Text style={styles.headerTitle}>Help</Text>
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

const LeaveApplyHeader = () => {
  const showAddForm = useLeaveDataStore(
    (state: LeaveDataState) => state.showAddForm
  );
  const setShowAddForm = useLeaveDataStore(
    (state: LeaveDataState) => state.setShowAddForm
  );
  const handleAddNew = () => {
    setShowAddForm(true);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainerLeaveApply}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Leave Apply</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addHomeworkButton}
          onPress={handleAddNew}
        >
          <Text className="text-white font-semibold text-base">
            + Add Leave Note
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function MainScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 20,
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="attendance"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 20,
                }}
              >
                Attendance
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="complain"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  marginLeft: 20,
                }}
              >
                Complain
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="assignments"
        options={{
          headerShown: true,
          header: () => <AssignmentHeader />,
        }}
      />
      <Stack.Screen
        name="examRoutine"
        options={{
          headerShown: true,
          header: () => <ExamRoutineHeader />,
        }}
      />
      <Stack.Screen
        name="homework"
        options={{
          headerShown: true,
          header: () => <HomeworkHeader />,
        }}
      />
      <Stack.Screen
        name="ai"
        options={{
          headerShown: true,
          header: () => <AIHomeworkHeader />,
        }}
      />
      <Stack.Screen
        name="classRoutine"
        options={{
          headerShown: true,
          header: () => <ClassRoutineHeader />,
        }}
      />
      <Stack.Screen
        name="vaccationHomeWork"
        options={{
          headerShown: true,
          header: () => <VaccationHomeWorkHeader />,
        }}
      />
      <Stack.Screen
        name="leaveApply"
        options={{
          headerShown: true,
          header: () => <LeaveApplyHeader />,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          headerShown: true,
          header: () => <ResultHeader />,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerShown: true,
          header: () => <HelpHeader />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          header: () => <SettingsHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#008AFF",
  },
  headerContainerLeaveApply: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#008AFF",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContainer: {
    backgroundColor: "#008AFF",
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
  addHomeworkButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
  },
});
