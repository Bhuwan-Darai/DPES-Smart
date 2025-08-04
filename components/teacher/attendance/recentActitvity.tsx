import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Sample attendance data and style function (replace or import yours)
const attendanceData = [
  {
    date: "2025-01-05",
    status: "Present",
    checkIn: "9:00 AM",
    checkOut: "5:00 PM",
    hours: 8,
  },
  { date: "2025-01-04", status: "Absent" },
  {
    date: "2025-01-03",
    status: "Late",
    checkIn: "9:30 AM",
    checkOut: "5:00 PM",
    hours: 7.5,
  },
  { date: "2025-01-02", status: "Weekend" },
  {
    date: "2025-01-01",
    status: "Sick Leave",
    checkIn: "10:00 AM",
    checkOut: "3:00 PM",
    hours: 5,
  },
  // ... add more
];

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "present":
      return { bg: "#D1FAE5", border: "#A7F3D0", text: "#065F46" };
    case "late":
      return { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" };
    case "absent":
      return { bg: "#FECACA", border: "#FCA5A5", text: "#991B1B" };
    case "sick leave":
      return { bg: "#DBEAFE", border: "#BFDBFE", text: "#1E40AF" };
    case "weekend":
      return { bg: "#F3F4F6", border: "#E5E7EB", text: "#6B7280" };
    default:
      return { bg: "#E5E7EB", border: "#D1D5DB", text: "#374151" };
  }
};

const RecentActivity = () => {
  const recentDays = attendanceData
    .filter((d) => !["weekend", "holiday"].includes(d.status.toLowerCase()))
    .slice(-7)
    .reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>

      {recentDays.map((day) => {
        const stylesStatus = getStatusStyles(day.status);
        const dayName = new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const date = new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <View key={day.date} style={styles.itemContainer}>
            <View style={styles.leftSide}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: stylesStatus.bg,
                    borderColor: stylesStatus.border,
                  },
                ]}
              />
              <View>
                <Text style={styles.dateText}>{`${dayName}, ${date}`}</Text>
                <Text style={[styles.statusText, { color: stylesStatus.text }]}>
                  {day.status}
                </Text>
              </View>
            </View>

            <View style={styles.rightSide}>
              {day.checkIn && day.checkOut ? (
                <>
                  <Text style={styles.timeRange}>
                    {day.checkIn} - {day.checkOut}
                  </Text>
                  <Text style={styles.hoursText}>{day.hours}h</Text>
                </>
              ) : (
                <Text style={styles.noData}>-</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  dateText: {
    fontWeight: "500",
    color: "#111827",
  },
  statusText: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  rightSide: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  timeRange: {
    fontSize: 13,
    color: "#4B5563",
  },
  hoursText: {
    fontSize: 11,
    color: "#6B7280",
  },
  noData: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});

export default RecentActivity;
