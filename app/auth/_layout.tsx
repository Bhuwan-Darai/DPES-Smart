import React, { useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  // const [login, setLogin] = useState(false);
  // // const { login } = useAuth();

  // if (login === true) {
  //   return <Redirect href="/(tabs)" />;
  // }

  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
