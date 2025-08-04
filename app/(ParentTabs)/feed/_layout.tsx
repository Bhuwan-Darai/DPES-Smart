import { Stack } from 'expo-router';
import React from 'react';

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          headerShown: false 
        }}
      />
    </Stack>
  );
} 