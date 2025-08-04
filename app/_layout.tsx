import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo";
import { AuthProvider } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/ui/ToastConfig";
// import registerForPushNotificationsAsync from "@/lib/registerPushNotification";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(splash)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(mainScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(adminScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(teacherScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(staffScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(parentScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(principalScreen)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(StaffTabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(TeacherTabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(ParentTabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(adminTabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(PrincipalTabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="materials/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
          <Toast config={toastConfig} />
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

// import React, { useEffect, Suspense } from 'react';
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { useFrameworkReady } from '@/lib/hooks/useFrameworkReady';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ApolloProvider } from '@apollo/client';
// import { client } from '@/lib/apollo/client';
// import { useAuth } from '@/lib/hooks/useAuth';
// import { StatusBar, View } from 'react-native';

// // Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

// function AppContent() {
//   const router = useRouter();
//   const segments = useSegments();
//   const [fontsLoaded, fontError] = useFonts({
//     // Add your custom fonts here if needed
//   });

//   const { login, loginLoading, loginError } = useAuth();

//   useFrameworkReady();

//   useEffect(() => {
//     const checkFirstLaunch = async () => {
//       try {
//         const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
//         if (!hasSeenSplash) {
//           router.replace('/(splash)' as any);
//         }
//       } catch (error) {
//         console.error('Error checking first launch:', error);
//       }
//     };

//     if (fontsLoaded || fontError) {
//       checkFirstLaunch();
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   // Return null to keep splash screen visible while fonts load
//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <View style={{ flex: 1, padding:2, paddingTop: 10  }}>
//          <StatusBar
//         translucent
//         backgroundColor="lightblue"
//         barStyle="dark-content"
//       />
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(splash)" options={{ headerShown: false }} />
//       <Stack.Screen name="(mainScreen)" options={{ headerShown: false }} />
//       <Stack.Screen name="auth" options={{ headerShown: false }} />
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen
//         name="materials/[id]"
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack></View>
//   );
// }

// export default function RootLayout() {

//   return (
//     <ApolloProvider client={client}>
//       <Suspense fallback={null}>
//         <AppContent />
//       </Suspense>
//     </ApolloProvider>
//   );
// }
