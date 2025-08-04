import ComingSoonComponent from "@/components/ui/ComingSoon";
import { Text, View } from "react-native";

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   StyleSheet,
//   StatusBar,
// } from "react-native";
// import {
//   VictoryPie,
//   VictoryBar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryAxis,
//   VictoryLine,
// } from "victory-native";

// const { width: screenWidth } = Dimensions.get("window");

// const SchoolFeeAnalytics = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState("monthly");

//   const totalStats = {
//     totalCollection: 245000,
//     totalStudents: 850,
//     pendingAmount: 45000,
//     collectionRate: 84.5,
//   };

//   const paymentMethodData = [
//     { x: "Bank", y: 145000 },
//     { x: "Cash", y: 70000 },
//     { x: "Card", y: 30000 },
//   ];

//   const monthlyCollectionData = [
//     { x: "Jan", y: 180 },
//     { x: "Feb", y: 165 },
//     { x: "Mar", y: 195 },
//     { x: "Apr", y: 220 },
//     { x: "May", y: 245 },
//     { x: "Jun", y: 210 },
//   ];

//   const feeTypeData = [
//     { x: "Tuition", y: 150 },
//     { x: "Transport", y: 45 },
//     { x: "Activity", y: 25 },
//     { x: "Library", y: 15 },
//     { x: "Lab", y: 10 },
//   ];

//   const statsData = [
//     {
//       title: "Total Collection",
//       value: `$${totalStats.totalCollection.toLocaleString()}`,
//       subtitle: "This month",
//       trend: "+12.5% from last month",
//       bgColor: "#dbeafe",
//       color: "#2563eb",
//     },
//     {
//       title: "Total Students",
//       value: totalStats.totalStudents.toLocaleString(),
//       subtitle: "Active enrollments",
//       bgColor: "#d1fae5",
//       color: "#059669",
//     },
//     {
//       title: "Pending Amount",
//       value: `$${totalStats.pendingAmount.toLocaleString()}`,
//       subtitle: "Outstanding fees",
//       bgColor: "#fed7aa",
//       color: "#ea580c",
//     },
//     {
//       title: "Collection Rate",
//       value: `${totalStats.collectionRate}%`,
//       subtitle: "Payment completion",
//       trend: "+3.2% improvement",
//       bgColor: "#e9d5ff",
//       color: "#9333ea",
//     },
//   ];

//   const transactions = [
//     {
//       student: "John Smith",
//       amount: 2500,
//       method: "Bank Transfer",
//       date: "2024-05-15",
//       status: "Completed",
//     },
//     {
//       student: "Sarah Johnson",
//       amount: 1800,
//       method: "Cash",
//       date: "2024-05-14",
//       status: "Completed",
//     },
//     {
//       student: "Mike Brown",
//       amount: 3200,
//       method: "Card Payment",
//       date: "2024-05-13",
//       status: "Pending",
//     },
//     {
//       student: "Lisa Davis",
//       amount: 2200,
//       method: "Bank Transfer",
//       date: "2024-05-12",
//       status: "Completed",
//     },
//     {
//       student: "Tom Wilson",
//       amount: 1900,
//       method: "Cash",
//       date: "2024-02-11",
//       status: "Completed",
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Period Selector */}
//         <View style={styles.periodSelector}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View style={styles.periodContainer}>
//               {["daily", "weekly", "monthly", "yearly"].map((period) => (
//                 <TouchableOpacity
//                   key={period}
//                   style={[
//                     styles.periodButton,
//                     selectedPeriod === period && styles.periodButtonActive,
//                   ]}
//                   onPress={() => setSelectedPeriod(period)}
//                 >
//                   <Text
//                     style={[
//                       styles.periodButtonText,
//                       selectedPeriod === period && styles.periodButtonTextActive,
//                     ]}
//                   >
//                     {period}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Stats Grid */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View style={styles.statsRow}>
//             {statsData.map((stat, index) => (
//               <View
//                 key={index}
//                 style={[styles.statCard, { backgroundColor: stat.bgColor }]}
//               >
//                 <Text style={styles.statTitle}>{stat.title}</Text>
//                 <Text style={[styles.statValue, { color: stat.color }]}>
//                   {stat.value}
//                 </Text>
//                 {stat.subtitle && (
//                   <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
//                 )}
//                 {stat.trend && (
//                   <Text style={styles.statTrend}>↗ {stat.trend}</Text>
//                 )}
//               </View>
//             ))}
//           </View>
//         </ScrollView>

//         {/* Pie Chart */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Payment Methods Distribution</Text>
//           <VictoryPie
//             data={paymentMethodData}
//             colorScale={["#3b82f6", "#10b981", "#f59e0b"]}
//             width={screenWidth - 72}
//             height={220}
//             labels={({ datum }: { datum: { x: string; y: number } }) =>
//               `${datum.x}\n${datum.y.toLocaleString()}`
//             }
//             style={{
//               labels: { fontSize: 12, fill: "#374151", fontWeight: "500" },
//             }}
//           />
//         </View>

//         {/* Line Chart */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Collection Trend</Text>
//           <VictoryChart width={screenWidth - 48} theme={VictoryTheme.material}>
//             <VictoryAxis />
//             <VictoryAxis dependentAxis />
//             <VictoryLine
//               data={monthlyCollectionData}
//               style={{
//                 data: { stroke: "#3b82f6", strokeWidth: 2 },
//               }}
//             />
//           </VictoryChart>
//         </View>

//         {/* Bar Chart */}
//         <View style={styles.chartContainer}>
//           <Text style={styles.chartTitle}>Fee Types Breakdown</Text>
//           <VictoryChart
//             domainPadding={20}
//             width={screenWidth - 48}
//             theme={VictoryTheme.material}
//           >
//             <VictoryAxis />
//             <VictoryAxis dependentAxis />
//             <VictoryBar
//               data={feeTypeData}
//               style={{
//                 data: {
//                   fill: "#3b82f6",
//                   strokeWidth: 2,
//                 },
//               }}
//             />
//           </VictoryChart>
//         </View>

//         {/* Transactions */}
//         <View style={styles.transactionSection}>
//           <Text style={styles.transactionTitle}>Recent Transactions</Text>
//           {transactions.map((transaction, index) => (
//             <View key={index} style={styles.transactionCard}>
//               <View style={styles.transactionRow}>
//                 <View style={styles.transactionLeft}>
//                   <Text style={styles.studentName}>{transaction.student}</Text>
//                   <Text style={styles.transactionDate}>{transaction.date}</Text>
//                 </View>
//                 <View style={styles.transactionRight}>
//                   <Text style={styles.transactionAmount}>
//                     ${transaction.amount.toLocaleString()}
//                   </Text>
//                   <Text style={styles.transactionMethod}>
//                     {transaction.method}
//                   </Text>
//                 </View>
//               </View>
//               <View
//                 style={[
//                   styles.statusBadge,
//                   {
//                     backgroundColor:
//                       transaction.status === "Completed"
//                         ? "#d1fae5"
//                         : "#fef3c7",
//                   },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.statusText,
//                     {
//                       color:
//                         transaction.status === "Completed"
//                           ? "#065f46"
//                           : "#92400e",
//                     },
//                   ]}
//                 >
//                   {transaction.status}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   header: {
//     padding: 24,
//     paddingHorizontal: 16,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//   },
//   periodSelector: {
//     padding: 16,
//   },
//   periodContainer: {
//     flexDirection: "row",
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     padding: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   periodButton: {
//     padding: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginHorizontal: 2,
//   },
//   periodButtonActive: {
//     backgroundColor: "#3b82f6",
//   },
//   periodButtonText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6b7280",
//     textTransform: "capitalize",
//   },
//   periodButtonTextActive: {
//     color: "#ffffff",
//   },
//   statsRow: {
//     flexDirection: "row",
//     paddingHorizontal: 8,
//   },
//   statCard: {
//     borderRadius: 16,
//     padding: 20,
//     margin: 8,
//     flex: 1,
//     minWidth: 160,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statTitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6b7280",
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   statSubtitle: {
//     fontSize: 12,
//     color: "#9ca3af",
//     marginBottom: 8,
//   },
//   statTrend: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#10b981",
//   },
//   chartContainer: {
//     backgroundColor: "#ffffff",
//     margin: 24,
//     marginBottom: 0,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 16,
//   },
//   chartStyle: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   transactionSection: {
//     marginVertical: 24,
//   },
//   transactionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   transactionCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   transactionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },
//   transactionLeft: {
//     flex: 1,
//   },
//   transactionRight: {
//     alignItems: "flex-end",
//   },
//   studentName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   transactionDate: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#10b981",
//     marginBottom: 4,
//   },
//   transactionMethod: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   statusBadge: {
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
// });

// export default SchoolFeeAnalytics;

const SchoolFeeAnalytics = () => {
  return (
    <View className="flex-1">
      <ComingSoonComponent />
    </View>
  );
};

export default SchoolFeeAnalytics;
