import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, BarChart2, TrendingUp, Award, Target, Book } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const subjects = [
  {
    name: 'Mathematics',
    grade: 'A',
    percentage: 92,
    trend: 'up',
  },
  {
    name: 'Physics',
    grade: 'A-',
    percentage: 88,
    trend: 'up',
  },
  {
    name: 'Chemistry',
    grade: 'B+',
    percentage: 85,
    trend: 'stable',
  },
  {
    name: 'Biology',
    grade: 'A',
    percentage: 90,
    trend: 'up',
  },
];

export default function PerformanceScreen() {
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
        <Text style={styles.headerTitle}>Performance</Text>
      </View> */}

      <ScrollView style={styles.content}>
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <BarChart2 size={24} color="#007AFF" />
              <Text style={styles.overviewTitle}>Academic Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3.9</Text>
                <Text style={styles.statLabel}>GPA</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>89%</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subject Performance</Text>
        {subjects.map((subject, index) => (
          <View key={index} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <View style={styles.subjectInfo}>
                <Book size={20} color="#007AFF" />
                <Text style={styles.subjectName}>{subject.name}</Text>
              </View>
              <View style={styles.gradeContainer}>
                <Text style={styles.gradeText}>{subject.grade}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${subject.percentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.percentageText}>{subject.percentage}%</Text>
            </View>

            <View style={styles.trendContainer}>
              <TrendingUp size={16} color={subject.trend === 'up' ? '#34C759' : '#8E8E93'} />
              <Text style={[
                styles.trendText,
                { color: subject.trend === 'up' ? '#34C759' : '#8E8E93' }
              ]}>
                {subject.trend === 'up' ? 'Improving' : 'Stable'}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.achievementsContainer}>
          <View style={styles.achievementCard}>
            <Award size={24} color="#FF9500" />
            <Text style={styles.achievementTitle}>Top Performer</Text>
            <Text style={styles.achievementDesc}>Mathematics - Last Quarter</Text>
          </View>
          <View style={styles.achievementCard}>
            <Target size={24} color="#34C759" />
            <Text style={styles.achievementTitle}>Goal Achieved</Text>
            <Text style={styles.achievementDesc}>90% Average Maintained</Text>
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
  overviewContainer: {
    marginBottom: 24,
  },
  overviewCard: {
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
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginLeft: 8,
  },
  gradeContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    width: 45,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 4,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
}); 