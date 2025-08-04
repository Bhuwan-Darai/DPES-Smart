import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  ChevronLeft,
  FileText,
  Clock,
  Trophy,
  Timer,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import ComingSoonComponent from "@/components/ui/ComingSoon";

const quizzes = [
  {
    id: "1",
    title: "Calculus Mid-Term",
    subject: "Mathematics",
    duration: "60 minutes",
    questions: 30,
    dueDate: "March 20, 2024",
    status: "available",
  },
  {
    id: "2",
    title: "Physics Quiz 3",
    subject: "Physics",
    duration: "30 minutes",
    questions: 20,
    score: "85%",
    status: "completed",
  },
  {
    id: "3",
    title: "Chemistry Test",
    subject: "Chemistry",
    duration: "45 minutes",
    questions: 25,
    dueDate: "March 25, 2024",
    status: "available",
  },
];

// export default function QuizzesScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       {/* <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Quizzes</Text>
//       </View> */}

//       <ScrollView style={styles.content}>
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>2</Text>
//             <Text style={styles.statLabel}>Available</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>1</Text>
//             <Text style={styles.statLabel}>Completed</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statNumber}>85%</Text>
//             <Text style={styles.statLabel}>Avg. Score</Text>
//           </View>
//         </View>

//         {quizzes.map((quiz) => (
//           <TouchableOpacity
//             key={quiz.id}
//             style={styles.quizCard}
//             onPress={() => {}}
//           >
//             <View style={styles.quizHeader}>
//               <View style={styles.titleContainer}>
//                 <FileText size={20} color="#007AFF" />
//                 <Text style={styles.quizTitle}>{quiz.title}</Text>
//               </View>
//               {quiz.status === 'completed' ? (
//                 <Trophy size={20} color="#34C759" />
//               ) : (
//                 <Timer size={20} color="#FF9500" />
//               )}
//             </View>

//             <Text style={styles.subjectText}>{quiz.subject}</Text>

//             <View style={styles.detailsContainer}>
//               <View style={styles.detailItem}>
//                 <Clock size={16} color="#8E8E93" />
//                 <Text style={styles.detailText}>{quiz.duration}</Text>
//               </View>
//               <View style={styles.detailItem}>
//                 <FileText size={16} color="#8E8E93" />
//                 <Text style={styles.detailText}>{quiz.questions} Questions</Text>
//               </View>
//             </View>

//             <View style={styles.footer}>
//               {quiz.status === 'completed' ? (
//                 <View style={styles.scoreContainer}>
//                   <Text style={styles.scoreText}>Score: {quiz.score}</Text>
//                 </View>
//               ) : (
//                 <TouchableOpacity style={styles.startButton}>
//                   <Text style={styles.startButtonText}>Start Quiz</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

export default function QuizzesScreen() {
  return (
    <View className="flex-1">
      <ComingSoonComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginLeft: 8,
  },
  subjectText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#007AFF",
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  scoreContainer: {
    backgroundColor: "#34C759",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  startButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
});
