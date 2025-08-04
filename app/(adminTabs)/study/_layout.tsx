import { Stack } from 'expo-router';
import React from 'react';

export default function StudyLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="material"
        options={{ 
          headerShown: true,
          headerTitle: "Study Material",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontFamily: 'Inter_900Black',
          },
        }}
      />
    </Stack>
  );
}