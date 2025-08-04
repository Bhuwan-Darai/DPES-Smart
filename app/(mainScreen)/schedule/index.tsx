import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = Array.from({ length: 8 }, (_, i) => `${i + 8}:00`);

export default function ScheduleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View> */}

      <ScrollView style={styles.content}>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Calendar size={24} color="#007AFF" />
            <Text style={styles.calendarTitle}>Week of March 18, 2024</Text>
          </View>
          
          <View style={styles.scheduleGrid}>
            <View style={styles.timeColumn}>
              {timeSlots.map((time, index) => (
                <View key={index} style={styles.timeSlot}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </View>

            {days.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.dayColumn}>
                <Text style={styles.dayHeader}>{day}</Text>
                {timeSlots.map((_, timeIndex) => (
                  <View key={timeIndex} style={styles.scheduleSlot}>
                    {dayIndex === 0 && timeIndex === 0 && (
                      <View style={styles.classCard}>
                        <Text style={styles.classTitle}>Mathematics</Text>
                        <Text style={styles.classTime}>8:00 - 9:00</Text>
                      </View>
                    )}
                    {dayIndex === 1 && timeIndex === 1 && (
                      <View style={styles.classCard}>
                        <Text style={styles.classTitle}>Physics</Text>
                        <Text style={styles.classTime}>9:00 - 10:00</Text>
                      </View>
                    )}
                    {dayIndex === 2 && timeIndex === 2 && (
                      <View style={styles.classCard}>
                        <Text style={styles.classTitle}>Chemistry</Text>
                        <Text style={styles.classTime}>10:00 - 11:00</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginLeft: 8,
  },
  scheduleGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  timeColumn: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  timeSlot: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  dayHeader: {
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  scheduleSlot: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    padding: 4,
  },
  classCard: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    padding: 8,
  },
  classTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  classTime: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
    opacity: 0.8,
  },
}); 