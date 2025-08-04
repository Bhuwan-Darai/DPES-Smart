// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
// import { ChevronLeft, User, Bell, Lock, Moon, Globe, HelpCircle, LogOut, ChevronRight, CloudCog } from 'lucide-react-native';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/AuthContext';
import ComingSoonComponent from "@/components/ui/ComingSoon";
import { View } from "react-native";

// type SettingAction = 'logout' | 'profile' | 'password' | 'notifications' | 'language' | 'help' | 'about';

// const settingsSections = [
//   {
//     title: 'Account',
//     items: [
//       { icon: User, label: 'Profile Settings', action: 'profile' as SettingAction },
//       { icon: Lock, label: 'Change Password', action: 'password' as SettingAction },
//       { icon: Bell, label: 'Notification Preferences', action: 'notifications' as SettingAction },
//     ],
//   },
//   {
//     title: 'Preferences',
//     items: [
//       { icon: Moon, label: 'Dark Mode', type: 'toggle' },
//       { icon: Globe, label: 'Language', action: 'language' as SettingAction },
//       { icon: Bell, label: 'Sound Effects', type: 'toggle' },
//     ],
//   },
//   {
//     title: 'Support',
//     items: [
//       { icon: HelpCircle, label: 'Help Center', action: 'help' as SettingAction },
//       { icon: Globe, label: 'About App', action: 'about' as SettingAction },
//       { icon: LogOut, label: 'Log Out', action: 'logout' as SettingAction },
//     ],
//   },
// ];

// export default function SettingsScreen() {
//   const router = useRouter();
//   const { logout } = useAuth();
//   const [darkMode, setDarkMode] = useState(false);
//   const [soundEffects, setSoundEffects] = useState(true);

//   const handleLogout = async () => {
//     try {
//       console.log('Starting logout process...');
//       await logout();
//       console.log('Logout successful, navigating to login screen...');
//       // Force navigation to login screen
//       router.replace('/auth/login' as any);
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Failed to logout. Please try again.');
//     }
//   };

//   const handleAction = async (action: SettingAction) => {
//     switch (action) {
//       case 'logout':
//         Alert.alert(
//           'Logout',
//           'Are you sure you want to logout?',
//           [
//             {
//               text: 'Cancel',
//               style: 'cancel',
//             },
//             {
//               text: 'Logout',
//               style: 'destructive',
//               onPress: handleLogout,
//             },
//           ]
//         );
//         break;
//       case 'profile':
//         router.push('/(tabs)/profile' as any);
//         break;
//       case 'password':
//         router.push('/(tabs)/settings/password' as any);
//         break;
//       case 'notifications':
//         router.push('/(tabs)/settings/notifications' as any);
//         break;
//       case 'language':
//         router.push('/(tabs)/settings/language' as any);
//         break;
//       case 'help':
//         router.push('/(tabs)/help' as any);
//         break;
//       case 'about':
//         router.push('/(tabs)/settings/about' as any);
//         break;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Settings</Text>
//       </View> */}

//       <ScrollView style={styles.content}>
//         {settingsSections.map((section, index) => (
//           <View key={index} style={styles.section}>
//             <Text style={styles.sectionTitle}>{section.title}</Text>
//             {section.items.map((item, itemIndex) => (
//               <TouchableOpacity
//                 key={itemIndex}
//                 style={styles.menuItem}
//                 onPress={() => item.type === 'toggle' ? null : handleAction(item.action as SettingAction)}
//               >
//                 <View style={styles.menuItemLeft}>
//                   <item.icon size={20} color="#333" />
//                   <Text style={styles.menuItemLabel}>{item.label}</Text>
//                 </View>
//                 {item.type === 'toggle' ? (
//                   <Switch
//                     value={item.label === 'Dark Mode' ? darkMode : soundEffects}
//                     onValueChange={(value) => {
//                       if (item.label === 'Dark Mode') {
//                         setDarkMode(value);
//                       } else {
//                         setSoundEffects(value);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <ChevronRight size={20} color="#666" />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // marginTop: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5EA',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#000',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#666',
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginBottom: 4,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   menuItemLabel: {
//     fontSize: 16,
//     fontFamily: 'Inter_400Regular',
//     color: '#333',
//     marginLeft: 12,
//   },
// });

export default function SettingsScreen() {
  return (
    <View className="flex-1">
      <ComingSoonComponent />
    </View>
  );
}
