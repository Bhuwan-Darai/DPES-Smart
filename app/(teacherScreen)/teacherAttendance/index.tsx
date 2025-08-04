import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react-native';
import { useQuery } from '@apollo/client';
import { GET_TEACHER_ATTENDANCE } from '@/lib/hooks/graphql/TeacherQueries';
import { format } from 'date-fns';
import { AttendanceDateState, useTeacherAttendanceDateStore } from '@/lib/zustand/attendanceDateStore';

// Define TypeScript interfaces matching the backend DTOs
interface AttendanceDate {
  attendanceDate: string;
  status: string;
  attendanceId?: string;
}

interface TeacherAttendance {
  avaerageAttendance?: string;
  totalDays?: string;
  presentDays?: string;
  absentDays?: string;
  teacherId?: string;
  attendanceDate?: AttendanceDate[];
}

export default function AttendanceScreen() {
  const selectedDate = useTeacherAttendanceDateStore(
    (state: AttendanceDateState) => state.selectedDate
  );
  const setSelectedDate = useTeacherAttendanceDateStore(
    (state: AttendanceDateState) => state.setSelectedDate
  );
  const today = selectedDate || ""; // "YYYY-MM-DD"
  const { data, loading, error } = useQuery<{ getTeacherAttendance: TeacherAttendance }>(
    GET_TEACHER_ATTENDANCE,
    {
      variables: {
        date: today,
        page: 1,
        limit: 20,
      },
    }
  );

  console.log("data", JSON.stringify(data, null, 2));
  console.log("error", JSON.stringify(error, null, 2));

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const attendance = data?.getTeacherAttendance;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>
            {attendance?.avaerageAttendance || '0%'}
          </Text>
          <Text style={styles.percentageLabel}>Attendance</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendance?.totalDays || '0'}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendance?.presentDays || '0'}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attendance?.absentDays || '0'}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {attendance?.attendanceDate?.map((day, index) => (
          <View key={index} style={styles.attendanceItem}>
            <View style={styles.dateContainer}>
              <CalendarIcon size={20} color="#6b7280" />
              <Text style={styles.dateText}>
                {format(new Date(day.attendanceDate), 'yyyy-MM-dd')}
              </Text>
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
        )) || (
          <Text style={styles.noDataText}>No attendance records available</Text>
        )}
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
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#ef4444',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
  },
});