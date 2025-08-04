import React from "react";
import {  Stack } from "expo-router";


export default function SeatPlanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "SeatPlan",
        }}
      />
    </Stack>
  );
}
