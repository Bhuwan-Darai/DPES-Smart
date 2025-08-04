import { router, Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

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
                }}
              >
                AI Courses
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
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
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="teacherList"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Teacher List
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="studentList"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Student List
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="staffList"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Staff List
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="teacherAttendance"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Teacher Attendance
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="feeAnalytics"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Fee Analytics
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
