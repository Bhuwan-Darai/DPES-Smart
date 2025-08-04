import { Stack } from 'expo-router';
import React from 'react';

export default function NewsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{ 
          headerShown: false,
          headerTitle: "News Detail",
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