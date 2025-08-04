import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GET_STUDENT_ATTENDANCE_FOR_PARENTS } from "@/lib/hooks/graphql/ParentQueries";
import { useQuery, useLazyQuery } from "@apollo/client";
// import { GET } from "http";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function AttendanceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [dateFilter, setDateFilter] = useState("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Date Picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Fetch initial data
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_STUDENT_ATTENDANCE_FOR_PARENTS,
    {
      variables: { studentId: id, page, limit, date: dateFilter },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Lazy query to load more pages
  const [loadMoreData] = useLazyQuery(GET_STUDENT_ATTENDANCE_FOR_PARENTS);

  // Load initial data
  useEffect(() => {
    if (data?.getAttendanceDetailsStudentWiseForParents?.data?.attendance) {
      setAttendanceData(
        data.getAttendanceDetailsStudentWiseForParents.data.attendance
      );
    }
  }, [data]);

  // Handle date selection
  const handleConfirmDate = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setDateFilter(formattedDate);
    setPage(1); // Reset page
    refetch({ studentId: id, page: 1, limit, date: formattedDate });
    hideDatePicker();
  };

  const showDatePicker = () => {
    // Set picker to current filter date or today
    const initialDate = dateFilter ? new Date(dateFilter) : new Date();
    setPickerDate(initialDate);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  // Load more data on scroll
  const loadNextPage = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    const result = await loadMoreData({
      variables: { studentId: id, page: nextPage, limit, date: dateFilter },
    });

    const newAttendance =
      result?.data?.getAttendanceDetailsStudentWiseForParents?.data
        ?.attendance || [];

    if (newAttendance.length === 0) {
      setHasMore(false);
    } else {
      setAttendanceData((prev) => [...prev, ...newAttendance]);
      setPage(nextPage);
    }
  };

  if (loading && !attendanceData.length) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  const student = data?.getAttendanceDetailsStudentWiseForParents?.data || {};

  const renderAttendanceItem = ({ item }: { item: any }) => {
    const statusColor =
      item.status === "present"
        ? "#2ecc71"
        : item.status === "absent"
        ? "#e74c3c"
        : "#f39c12";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.date}>
            {moment(item.date).format("MMM DD, YYYY")}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
          <MaterialCommunityIcons name="calendar" size={20} color="#fff" />
          <Text style={styles.dateButtonText}>
            {dateFilter ? moment(dateFilter).format("MMM DD") : "All Dates"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.summaryCard}>
        <SummaryBox
          label="Total Present"
          value={student.totalClassAttended}
          icon="check-circle"
          color="#2ecc71"
        />
        <SummaryBox
          label="Total Absent"
          value={student.totalClassMissed}
          icon="close-circle"
          color="#e74c3c"
        />
        <SummaryBox
          label="Avg. Attendance"
          value={`${student.averageAttendance}%`}
          icon="chart-line"
          color="#3498db"
        />
      </View>

      {/* Attendance List */}
      <FlashList
        data={attendanceData}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.attendanceId}
        estimatedItemSize={60}
        showsVerticalScrollIndicator={false}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text>No attendance records found.</Text>
          </View>
        }
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

// Reusable Summary Box
const SummaryBox = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) => (
  <View style={styles.summaryBox}>
    <MaterialCommunityIcons name={icon} size={24} color={color} />
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0056b3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateButtonText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryBox: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
