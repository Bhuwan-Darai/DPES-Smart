import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Sample `attendanceData` & `getStatusStyles` - Replace or import from your logic
const attendanceData = [
  {
    date: "2025-01-01",
    status: "Present",
    checkIn: "9:00 AM",
    checkOut: "5:00 PM",
  },
  {
    date: "2025-01-02",
    status: "Late",
    checkIn: "9:30 AM",
    checkOut: "5:00 PM",
  },
  { date: "2025-01-03", status: "Absent" },
  { date: "2025-01-04", status: "Weekend" },
  { date: "2025-01-05", status: "Sick Leave" },
  // ...add remaining dates
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Present":
      return { bg: "#D1FAE5", border: "#A7F3D0", text: "#065F46" };
    case "Late":
      return { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" };
    case "Absent":
      return { bg: "#FECACA", border: "#FCA5A5", text: "#991B1B" };
    case "Sick Leave":
      return { bg: "#DBEAFE", border: "#BFDBFE", text: "#1E40AF" };
    case "Weekend":
      return { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280" };
    default:
      return { bg: "#FFFFFF", border: "#D1D5DB", text: "#000000" };
  }
};

const AttendanceCalendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(2025, 1, 0).getDate(); // Jan has 31 days
  const firstDay = new Date(2025, 0, 1).getDay(); // 0 = Sunday

  const emptyCells = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>January 2025 Calendar</Text>

      <View style={styles.grid}>
        {days.map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}

        {emptyCells.map((_, i) => (
          <View key={`empty-${i}`} style={styles.emptyCell} />
        ))}

        {attendanceData.map((day) => {
          const date = new Date(day.date).getDate();
          const style = getStatusStyles(day.status);

          return (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dayCell,
                {
                  backgroundColor: style.bg,
                  borderColor: style.border,
                },
              ]}
              onPress={() => {
                // Handle click, show modal or details if needed
              }}
            >
              <Text style={[styles.dayText, { color: style.text }]}>
                {date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        {[
          { color: "#D1FAE5", border: "#A7F3D0", label: "Present" },
          { color: "#FEF3C7", border: "#FDE68A", label: "Late" },
          { color: "#FECACA", border: "#FCA5A5", label: "Absent" },
          { color: "#DBEAFE", border: "#BFDBFE", label: "Sick Leave" },
          { color: "#F3F4F6", border: "#E5E7EB", label: "Weekend" },
        ].map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: item.color, borderColor: item.border },
              ]}
            />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  weekday: {
    width: "14.2%",
    textAlign: "center",
    fontWeight: "500",
    color: "#6B7280",
    paddingVertical: 4,
  },
  emptyCell: {
    width: "14.2%",
    height: 40,
  },
  dayCell: {
    width: "14.2%",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 12,
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  legendLabel: {
    color: "#4B5563",
    fontSize: 12,
  },
});

export default AttendanceCalendar;
