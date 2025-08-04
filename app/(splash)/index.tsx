import React, { useEffect } from 'react';
import { View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '@/components/SplashScreen';

export default function SplashRoute() {
  useEffect(() => {
    const markSplashSeen = async () => {
      try {
        await AsyncStorage.setItem('hasSeenSplash', 'true');
      } catch (error) {
        console.error('Error marking splash as seen:', error);
      }
    };
    markSplashSeen();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SplashScreen />
    </View>
  );
} 