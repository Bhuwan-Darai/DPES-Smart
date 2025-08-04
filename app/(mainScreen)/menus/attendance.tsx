import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react-native';

export default function AttendanceScreen() {
  const attendanceData = {
    totalDays: 220,
    presentDays: 210,
    absentDays: 10,
    percentage: 95.45,
    recentAttendance: [
      { date: '2024-01-15', status: 'present', subject: 'All Classes' },
      { date: '2024-01-14', status: 'present', subject: 'All Classes' },
      { date: '2024-01-13', status: 'absent', subject: 'All Classes' },
      { date: '2024-01-12', status: 'present', subject: 'All Classes' },
      { date: '2024-01-11', status: 'present', subject: 'All Classes' },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{attendanceData.percentage}%</Text>
          <Text style={styles.percentageLabel}>Attendance</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendanceData.totalDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendanceData.presentDays}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendanceData.absentDays}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {attendanceData.recentAttendance.map((day, index) => (
          <View key={index} style={styles.attendanceItem}>
            <View style={styles.dateContainer}>
              <CalendarIcon size={20} color="#6b7280" />
              <Text style={styles.dateText}>{day.date}</Text>
            </View>
            <View style={styles.statusContainer}>
              {day.status === 'present' ? (
                <CheckCircle2 size={20} color="#22c55e" />
              ) : (
                <XCircle size={20} color="#ef4444" />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: day.status === 'present' ? '#22c55e' : '#ef4444' },
                ]}
              >
                {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  percentageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  percentageLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
}); 