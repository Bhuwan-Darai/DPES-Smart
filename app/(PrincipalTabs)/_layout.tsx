import { useAuth } from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { isAuthenticated, userDetails } = useAuth();

  if (!isAuthenticated || userDetails?.role !== "Principal") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="study"
        options={{
          title: "Study",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="newspaper-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bars" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
