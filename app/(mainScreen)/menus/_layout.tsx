import React from 'react';
import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          title: 'My Profile',
        }}
      />
      <Stack.Screen
        name="attendance"
        options={{
          headerShown: true,
          title: 'Attendance',
        }}
      />
      <Stack.Screen
        name="assignments"
        options={{
          headerShown: true,
          title: 'Assignments',
        }}
      />
      <Stack.Screen
        name="timetable"
        options={{
          headerShown: true,
          title: 'Time Table',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerShown: true,
          title: 'Help & Support',
        }}
      />
    </Stack>
  );
} 