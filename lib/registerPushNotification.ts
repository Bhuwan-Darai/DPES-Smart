// import React, { useEffect } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // 🔹 Step 1: Request notification permissions
// const requestNotificationPermissions = async () => {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.log("Permission not granted");
//     return false;
//   }

//   return true;
// };

// // 🔹 Step 2: Get FCM Token
// const getFCMToken = async () => {
//   if (!Device.isDevice) {
//     console.warn("Must use physical device");
//     return null;
//   }

//   try {
//     const fcmToken = await getToken(getMessaging(), {
//       vapidKey: "YOUR_VAPID_PUBLIC_KEY", // From Firebase Project Settings > Cloud Messaging
//     });

//     console.log("FCM Token:", fcmToken);
//     return fcmToken;
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//     return null;
//   }
// };

// // 🔹 Step 3: Save token to AsyncStorage
// const saveTokenToAsyncStorage = async (token: string) => {
//   try {
//     await AsyncStorage.setItem("fcmToken", token);
//     console.log("FCM Token saved to AsyncStorage");
//   } catch (error) {
//     console.error("Error saving FCM token to AsyncStorage:", error);
//   }
// };

// // 🔹 Step 4: Get token from AsyncStorage
// const getTokenFromAsyncStorage = async (): Promise<string | null> => {
//   try {
//     const token = await AsyncStorage.getItem("fcmToken");
//     return token;
//   } catch (error) {
//     console.error("Error getting FCM token from AsyncStorage:", error);
//     return null;
//   }
// };

// // 🔹 Step 5: Send token to backend via GraphQL
// const sendTokenToBackend = async (token: string, userId: string) => {
//   try {
//     // Get the GraphQL client and user details
//     const userDetailsString = await AsyncStorage.getItem("userDetails");
//     const authToken = await AsyncStorage.getItem("token");

//     if (!userDetailsString || !authToken) {
//       console.warn("User details or auth token not found");
//       return false;
//     }

//     const userDetails = JSON.parse(userDetailsString);

//     // Create subscription object
//     const subscription = {
//       endpoint: `https://fcm.googleapis.com/fcm/send/${token}`,
//       keys: {
//         p256dh: "your-p256dh-key", // You might need to generate this
//         auth: "your-auth-key", // You might need to generate this
//       },
//     };

//     // GraphQL mutation to save push subscription
//     const mutation = `
//       mutation SavePushSubscription($userId: String!, $subscription: String!) {
//         savePushSubscription(userId: $userId, subscription: $subscription)
//       }
//     `;

//     const response = await fetch("YOUR_GRAPHQL_ENDPOINT", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({
//         query: mutation,
//         variables: {
//           userId: userId,
//           subscription: JSON.stringify(subscription),
//         },
//       }),
//     });

//     const result = await response.json();

//     if (result.data?.savePushSubscription) {
//       console.log("Token sent to backend successfully");
//       return true;
//     } else {
//       console.warn("Failed to send token to backend:", result.errors);
//       return false;
//     }
//   } catch (error) {
//     console.error("Error sending token to backend:", error);
//     return false;
//   }
// };

// // 🔹 Step 6: Handle foreground messages
// const listenToForegroundMessages = () => {
//   onMessage(getMessaging(), (payload) => {
//     console.log("Foreground message received:", payload);

//     // Optional: Show local notification
//     Notifications.scheduleNotificationAsync({
//       content: {
//         title: payload.notification?.title || "New Message",
//         body: payload.notification?.body || "You have a new update!",
//         data: payload.data,
//       },
//       trigger: null,
//     });
//   });
// };

// // 🔹 Step 7: Initialize push notifications with user context
// const initializePushNotifications = async (userId: string) => {
//   try {
//     const permissionGranted = await requestNotificationPermissions();
//     if (!permissionGranted) {
//       console.log("Notification permission not granted");
//       return false;
//     }

//     const fcmToken = await getFCMToken();
//     if (fcmToken) {
//       // Save to AsyncStorage
//       await saveTokenToAsyncStorage(fcmToken);

//       // Send to backend
//       const success = await sendTokenToBackend(fcmToken, userId);

//       if (success) {
//         console.log("Push notifications initialized successfully");
//         return true;
//       } else {
//         console.warn("Failed to initialize push notifications");
//         return false;
//       }
//     } else {
//       console.warn("Failed to get FCM token");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error initializing push notifications:", error);
//     return false;
//   }
// };

// // 🔹 Step 8: Refresh token and update backend
// const refreshPushToken = async (userId: string) => {
//   try {
//     const fcmToken = await getFCMToken();
//     if (fcmToken) {
//       await saveTokenToAsyncStorage(fcmToken);
//       const success = await sendTokenToBackend(fcmToken, userId);
//       return success;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error refreshing push token:", error);
//     return false;
//   }
// };

// // 🔹 Main registration function (legacy - kept for backward compatibility)
// const registerForPushNotificationsAsync = async () => {
//   const permissionGranted = await requestNotificationPermissions();
//   if (!permissionGranted) return;

//   const fcmToken = await getFCMToken();
//   if (fcmToken) {
//     await saveTokenToAsyncStorage(fcmToken);
//   }

//   listenToForegroundMessages();
// };

// export default registerForPushNotificationsAsync;
// export {
//   initializePushNotifications,
//   refreshPushToken,
//   getTokenFromAsyncStorage,
//   saveTokenToAsyncStorage,
//   listenToForegroundMessages,
//   requestNotificationPermissions,
//   getFCMToken,
// };
