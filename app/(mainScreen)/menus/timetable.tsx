import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, BookOpen } from 'lucide-react-native';

export default function TimetableScreen() {
  const timetableData = [
    {
      time: '08:00 - 09:00',
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      room: 'Room 101',
    },
    {
      time: '09:15 - 10:15',
      subject: 'Physics',
      teacher: 'Prof. Johnson',
      room: 'Lab 201',
    },
    {
      time: '10:30 - 11:30',
      subject: 'Chemistry',
      teacher: 'Dr. Williams',
      room: 'Lab 202',
    },
    {
      time: '11:45 - 12:45',
      subject: 'English',
      teacher: 'Mrs. Brown',
      room: 'Room 103',
    },
    {
      time: '13:30 - 14:30',
      subject: 'Biology',
      teacher: 'Dr. Davis',
      room: 'Lab 203',
    },
    {
      time: '14:45 - 15:45',
      subject: 'Computer Science',
      teacher: 'Mr. Wilson',
      room: 'Lab 301',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.currentDay}>Monday</Text>
        <Text style={styles.currentDate}>January 15, 2024</Text>
      </View>

      <View style={styles.timetableContainer}>
        {timetableData.map((period, index) => (
          <View key={index} style={styles.periodCard}>
            <View style={styles.timeContainer}>
              <Clock size={16} color="#6b7280" />
              <Text style={styles.timeText}>{period.time}</Text>
            </View>
            
            <View style={styles.subjectContainer}>
              <View style={styles.subjectHeader}>
                <BookOpen size={20} color="#007AFF" />
                <Text style={styles.subjectText}>{period.subject}</Text>
              </View>
              <View style={styles.periodDetails}>
                <Text style={styles.teacherText}>{period.teacher}</Text>
                <Text style={styles.roomText}>{period.room}</Text>
              </View>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  currentDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 16,
    color: '#6b7280',
  },
  timetableContainer: {
    padding: 16,
  },
  periodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  subjectContainer: {
    marginLeft: 24,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  periodDetails: {
    marginLeft: 28,
  },
  teacherText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  roomText: {
    fontSize: 14,
    color: '#6b7280',
  },
}); 