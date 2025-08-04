import React from "react";
import { Stack } from "expo-router";

export default function AssignmentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="assignmentDetails"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
