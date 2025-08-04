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
    </Stack>
  );
}
