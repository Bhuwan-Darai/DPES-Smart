import { View, Text } from "react-native";
import React from "react";
import ComingSoonComponent from "@/components/ui/ComingSoon";

// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Cpu, Wifi, Cloud, Shield } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// type IoTCourseParamList = {
//   IoTCourseId: { id: string };
// };

// export default function IoTScreen() {
//   const iotCourses = [
//     {
//       id: 'iot-fundamentals',
//       title: 'IoT Fundamentals',
//       description: 'Introduction to IoT architecture, protocols, and applications',
//       icon: Cpu,
//       progress: 30,
//       difficulty: 'Beginner',
//       duration: '6 weeks',
//     },
//     {
//       id: 'wireless-networking',
//       title: 'Wireless Networking for IoT',
//       description: 'Learn about wireless protocols, connectivity, and networking',
//       icon: Wifi,
//       progress: 45,
//       difficulty: 'Intermediate',
//       duration: '8 weeks',
//     },
//     {
//       id: 'cloud-integration',
//       title: 'IoT Cloud Integration',
//       description: 'Connect IoT devices to cloud platforms and services',
//       icon: Cloud,
//       progress: 20,
//       difficulty: 'Advanced',
//       duration: '10 weeks',
//     },
//     {
//       id: 'iot-security',
//       title: 'IoT Security',
//       description: 'Security best practices and protocols for IoT devices',
//       icon: Shield,
//       progress: 15,
//       difficulty: 'Advanced',
//       duration: '8 weeks',
//     },
//   ];

//   const navigation = useNavigation<NativeStackNavigationProp<IoTCourseParamList, 'IoTCourseId'>>();

//   return (
//     <View style={styles.container}>

//       <ScrollView style={styles.content}>
//         <Text style={styles.title}>IoT Learning Path</Text>

//         {iotCourses.map((course, index) => (
//           <TouchableOpacity key={index} style={styles.topicCard}   onPress={() => navigation.navigate('IoTCourseId', {
//             id: course.id

//           })}>
//             <View style={styles.topicHeader}>
//               <course.icon size={24} color="#007AFF" />
//               <Text style={styles.topicTitle}>{course.title}</Text>
//             </View>
//             <Text style={styles.topicDescription}>{course.description}</Text>
//             <View style={styles.progressContainer}>
//               <View style={styles.progressBar}>
//                 <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
//               </View>
//               <Text style={styles.progressText}>{course.progress}% Complete</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#000',
//   },
//   topicCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   topicHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   topicTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginLeft: 12,
//     color: '#000',
//   },
//   topicDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progressBar: {
//     flex: 1,
//     height: 6,
//     backgroundColor: '#E5E5EA',
//     borderRadius: 3,
//     marginRight: 8,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#007AFF',
//     borderRadius: 3,
//   },
//   progressText: {
//     fontSize: 12,
//     color: '#666',
//   },
// });

export default function IOTScreen() {
  return (
    <View className="flex-1">
      <ComingSoonComponent />
    </View>
  );
}
