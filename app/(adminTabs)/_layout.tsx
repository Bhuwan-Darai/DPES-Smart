// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Svg, { Path } from 'react-native-svg';
// import { createStackNavigator } from '@react-navigation/stack';
// import {
//   Home as HomeIcon,
//   BookOpen as StudyIcon,
//   Newspaper as NewsIcon,
//   Menu as MenuIcon,
//   Users as FeedIcon
// } from 'lucide-react-native';

// // Import additional screens that won't show in bottom tab
// import TodayNewsScreen from '../(mainScreen)/todaynews';
// import TodayQuizScreen from '../(mainScreen)/todayquiz';
// import NotificationsScreen from '../(mainScreen)/notifications';
// import ExtraLearningScreen from '../(mainScreen)/extra-learning';
// import HelpScreen from '../(mainScreen)/help';
// import CoursesScreen from '../(mainScreen)/courses';
// import SettingsScreen from '../(mainScreen)/settings';
// import AssignmentsScreen from '../(mainScreen)/assignments';
// import ScheduleScreen from '../(mainScreen)/schedule';
// import AchievementsScreen from '../(mainScreen)/achievements';
// import PerformanceScreen from '../(mainScreen)/performance';
// import QuizzesScreen from '../(mainScreen)/quizzes';
// import ProfileScreen from '../(mainScreen)/profile';
// import AttendanceScreen from '../(mainScreen)/attendance';

// import TimetableScreen from '../(mainScreen)/timetable';
// import NewsDetail from '../(mainScreen)/news/[id]';
// import ExtraLearningDetail from '../(mainScreen)/extra-learning/[id]';
// import IOTScreen from '../(mainScreen)/iot';
// import ProgrammingScreen from '../(mainScreen)/programming/page';

// import IOTCourseScreen from '../(mainScreen)/iot/[id]';
// import ProgrammingCourseScreen from '../(mainScreen)/programming/[id]';
// import HomeScreen from './index';
// import FeedScreen from '../(mainScreen)/feed';
// import StudyScreen from '../(mainScreen)/study';
// import NewsScreen from '../(mainScreen)/news';
// import MenuScreen from './menu';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import AIScreen from '../(mainScreen)/ai';
// import AICourseScreen from '../(mainScreen)/ai/[id]';
// import SavedContentScreen from '../(mainScreen)/menu/saved-content';

// const { width } = Dimensions.get('window');
// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// const CustomTabBar = ({
//   state,
//   descriptors,
//   navigation
// }: {
//   state: any;
//   descriptors: any;
//   navigation: any;
// }) => {
//   const getDepressionPath = (index: number) => {
//     const itemWidth = width / 5;
//     const startX = itemWidth * index + itemWidth / 2;
//     const curveHeight = 30;
//     const curveWidth = 100;

//     return `
//       M0,60
//       H${startX - curveWidth}
//       C${startX - curveWidth / 2},60 ${startX - curveWidth / 4},${60 + curveHeight} ${startX},${60 + curveHeight}
//       C${startX + curveWidth / 4},${60 + curveHeight} ${startX + curveWidth / 2},60 ${startX + curveWidth},60
//       H${width}
//       V260 H0 Z
//     `;
//   };

//   return (
//     <View style={{
//       position: 'absolute',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       height: 80,  // Reduced height
//       borderTopWidth: 1,
//       borderColor: '#e5e7eb',
//       borderLeftWidth: 1,
//       borderRightWidth: 1,
//       borderBottomWidth: 1,
//       backgroundColor: '#fff',
//     }}>
//       <Svg
//         width={width}
//         height={80}  // Reduced height
//         style={{
//           position: 'absolute',
//           bottom: 0,
//         }}
//       >
//         <Path
//           d={getDepressionPath(state.index)}
//           fill="#ffffff"
//         />
//       </Svg>

//       <View style={{
//         flexDirection: 'row',
//         height: 80,
//         backgroundColor: 'transparent',  // Ensure transparency
//         zIndex: 1,  // Bring buttons to front
//       }}>
//         {state.routes.map((route: { key: string, name: string }, index: number) => {
//           const { options } = descriptors[route.key];
//           const Icon = options.tabBarIcon;
//           const label = options.title || route.name;
//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: 'tabPress',
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={onPress}
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 2,  // Ensure buttons are above the SVG
//               }}
//             >
//               <View style={[
//                 {
//                   padding: 12,
//                   borderRadius: 99,
//                   marginTop: isFocused ? -20 : 0,  // Adjusted positioning
//                 },
//                 isFocused
//                   ? {
//                       backgroundColor: '#3b82f6',
//                     }
//                   : {
//                       backgroundColor: 'transparent',
//                     }
//               ]}>
//                 {Icon && Icon({
//                   size: 20,
//                   color: isFocused ? 'white' : '#4b5563',
//                   strokeWidth: 2
//                 })}
//               </View>
//               <Text
//                 style={[
//                   {
//                     fontSize: 12,
//                     fontWeight: '500',
//                     marginTop: 4,
//                   },
//                   {
//                     color: isFocused ? '#3b82f6' : '#4b5563'
//                   }
//                 ]}
//               >
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default function BottomTabNavigator() {
//   return (

//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="(tabs)"  options={{ headerShown: false }}>
//       {() => (
//         <Tab.Navigator
//           tabBar={(props) => <CustomTabBar {...props} />}
//           screenOptions={{ headerShown: false }}
//         >
//          <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <HomeIcon size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Feed"
//         component={FeedScreen}
//         options={{
//           title: 'Feed',
//           tabBarIcon: ({ color, size }) => (
//             <FeedIcon size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Study"
//         component={StudyScreen}
//         options={{
//           title: 'Study',
//           tabBarIcon: ({ color, size }) => (
//             <StudyIcon size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="News"
//         component={NewsScreen}
//         options={{
//           title: 'News',
//           tabBarIcon: ({ color, size }) => (
//             <NewsIcon size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Menu"
//         component={MenuScreen}
//         options={{
//           title: 'Menu',
//           tabBarIcon: ({ color, size }) => (
//             <MenuIcon size={size} color={color} />
//           ),
//         }}
//       />
//         </Tab.Navigator>
//       )}
//     </Stack.Screen>

//     {/* Add additional screens outside of the tab navigator */}

//     <Stack.Screen
//       name="Courses"
//       component={CoursesScreen}
//     />
//     <Stack.Screen
//       name="TodayNews"
//       component={TodayNewsScreen}
//       />
//       <Stack.Screen
//       name="TodayQuiz"
//       component={TodayQuizScreen}
//       />
//       <Stack.Screen
//       name="Notifications"
//       component={NotificationsScreen}
//       />
//       <Stack.Screen
//       name="Help"
//       component={HelpScreen}
//       />
//       <Stack.Screen
//       name="ExtraLearning"
//       component={ExtraLearningScreen}
//       />
//       <Stack.Screen
//       name="ExtraLearningId"
//       component={ExtraLearningDetail}
//       />
//       <Stack.Screen
//       name="Settings"
//       component={SettingsScreen}
//       />
//       <Stack.Screen
//       name="SavedContent"
//       component={SavedContentScreen}
//       />
//       <Stack.Screen
//       name="Schedule"
//       component={ScheduleScreen}
//       />
//       <Stack.Screen
//       name="Assignments"
//       component={AssignmentsScreen}
//       />
//       <Stack.Screen
//       name="Achievements"
//       component={AchievementsScreen}
//       />
//       <Stack.Screen
//       name="Performance"
//       component={PerformanceScreen}
//       />
//       <Stack.Screen
//       name="Quizzes"
//         component={QuizzesScreen} />
//       <Stack.Screen
//       name="Profile"
//       component={ProfileScreen}
//       />
//       <Stack.Screen
//       name="Attendance"
//       component={AttendanceScreen}
//       />

//       <Stack.Screen
//       name="Timetable"
//       component={TimetableScreen}
//       />
//         <Stack.Screen
//       name="NewsId"
//       component={NewsDetail}
//       />

//       <Stack.Screen
//       name="IOT"
//       component={IOTScreen}
//       />
//       <Stack.Screen
//       name="Programming"
//       component={ProgrammingScreen}
//       />
//       <Stack.Screen
//       name="AI"
//       component={AIScreen}
//       />
//       <Stack.Screen
//       name="AICourseId"
//       component={AICourseScreen}
//       />
//       <Stack.Screen
//       name="IoTCourseId"
//       component={IOTCourseScreen}
//       />
//       <Stack.Screen
//       name="ProgrammingCourseId"
//       component={ProgrammingCourseScreen}
//       />

//     {/* Add other screens similarly */}
//   </Stack.Navigator>
//   );
// }

import { useAuth } from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { isAuthenticated , userDetails} = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "Study",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="newspaper-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bars" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
