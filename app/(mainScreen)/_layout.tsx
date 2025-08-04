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
                  marginLeft: 20,
                }}
              >
                AI Courses
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="achievements"
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
                Achievements
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="attendance" options={{ headerShown: true }} />
      <Stack.Screen
        name="assignments"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Assignments
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="timetable"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Timetable
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
                  // marginLeft: 10,
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="courses"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Courses
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="todaynews"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Today News
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Schedule
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="programming"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Programming
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      {/* <Stack.Screen
        name="notifications"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Notifications
              </Text>
            </TouchableOpacity>
          ),
        }}
      /> */}
      <Stack.Screen
        name="homework"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Homework
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="performance"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Performance
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="menus"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Menus
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Menu
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="iot"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                IOT
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Help
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="feed"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Feed
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="extraLearning"
        options={{
          headerShown: false,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Extra Learning
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="news"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                News
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="todayquiz"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Today Quiz
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="quizzes"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Quizzes
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="examRoutine"
        options={{
          headerShown: true,
          headerTitle: () => (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                  // marginLeft: 10,
                }}
              >
                Exam Routine
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
