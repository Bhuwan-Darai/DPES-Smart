import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Attendance status enum
export enum AttendanceStatus {
  present = 'present',
  absent = 'absent',
  late = 'late'
}

// Types
interface AttendanceRecord {
  date: Date;
  status: AttendanceStatus;
}

interface NepaliDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
}

interface CalendarDay {
  day: number | null;
  nepaliDay?: string;
  englishDate?: string;
  attendance?: AttendanceRecord;
  isEmpty: boolean;
}

interface NepaliCalendarProps {
  attendanceDates?: AttendanceRecord[];
  currentDate?: Date;
}

// Nepali months
const nepaliMonths: string[] = [
  'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
];

// Nepali digits
const nepaliDigits: string[] = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// Days of week in Nepali
const nepaliDays: string[] = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

// Convert English number to Nepali
const toNepaliNumber = (num: number): string => {
  return num.toString().split('').map(digit => nepaliDigits[parseInt(digit)]).join('');
};

// Accurate Nepali date conversion for year 2082
const englishToNepali = (englishDate: Date): NepaliDate => {
  if (!(englishDate instanceof Date) || isNaN(englishDate.getTime())) {
    console.warn('Invalid date provided to englishToNepali:', englishDate);
    return { year: 2082, month: 1, day: 1, dayOfWeek: 0 };
  }
  
  const date = new Date(englishDate);
  const baishakh1_2082 = new Date(2025, 3, 14); // April 14, 2025
  const diffTime = date.getTime() - baishakh1_2082.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let nepaliYear = 2082;
  let nepaliMonth = 1;
  let nepaliDay = 1 + diffDays;
  
  if (diffDays < 0) {
    nepaliYear = 2081;
    nepaliMonth = 12;
    nepaliDay = 30 + diffDays + 1;
    while (nepaliDay <= 0) {
      nepaliMonth--;
      if (nepaliMonth < 1) {
        nepaliMonth = 12;
        nepaliYear--;
      }
      const daysInPrevMonth = getDaysInNepaliMonth(nepaliYear, nepaliMonth);
      nepaliDay += daysInPrevMonth;
    }
  } else {
    while (nepaliDay > getDaysInNepaliMonth(nepaliYear, nepaliMonth)) {
      nepaliDay -= getDaysInNepaliMonth(nepaliYear, nepaliMonth);
      nepaliMonth++;
      if (nepaliMonth > 12) {
        nepaliMonth = 1;
        nepaliYear++;
      }
    }
  }
  
  return {
    year: nepaliYear,
    month: nepaliMonth,
    day: nepaliDay,
    dayOfWeek: date.getDay()
  };
};

// Get days in Nepali month for year 2082
const getDaysInNepaliMonth = (year: number, month: number): number => {
  if (year === 2082) {
    const daysInMonth: number[] = [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 29, 30];
    return daysInMonth[month - 1] || 30;
  }
  const defaultDays: number[] = [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31];
  return defaultDays[month - 1] || 30;
};

const NepaliCalendar: React.FC<NepaliCalendarProps> = ({ 
  attendanceDates = [], 
  currentDate = new Date()
}) => {
  console.log("attendanceDates", attendanceDates);
  const [currentNepaliDate, setCurrentNepaliDate] = useState<NepaliDate | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const kathmanduDate = new Date(currentDate.toLocaleString("en-US", {timeZone: "Asia/Kathmandu"}));
    const nepaliDate = englishToNepali(kathmanduDate);
    setCurrentNepaliDate(nepaliDate);
    generateCalendar(nepaliDate);
  }, [currentDate, attendanceDates]);

  const generateCalendar = (nepaliDate: NepaliDate): void => {
    const daysInMonth = getDaysInNepaliMonth(nepaliDate.year, nepaliDate.month);
    let firstDayEnglish = new Date();
    let tempNepaliDate = { ...nepaliDate, day: 1 };
    
    let totalDaysFromBaishakh1 = 0;
    if (tempNepaliDate.year === 2082) {
      for (let m = 1; m < tempNepaliDate.month; m++) {
        totalDaysFromBaishakh1 += getDaysInNepaliMonth(2082, m);
      }
    } else if (tempNepaliDate.year > 2082) {
      for (let m = 1; m <= 12; m++) {
        totalDaysFromBaishakh1 += getDaysInNepaliMonth(2082, m);
      }
      for (let y = 2083; y < tempNepaliDate.year; y++) {
        totalDaysFromBaishakh1 += 365;
      }
      for (let m = 1; m < tempNepaliDate.month; m++) {
        totalDaysFromBaishakh1 += getDaysInNepaliMonth(tempNepaliDate.year, m);
      }
    } else {
      for (let y = tempNepaliDate.year; y < 2082; y++) {
        totalDaysFromBaishakh1 -= 365;
      }
      if (tempNepaliDate.year === 2081) {
        for (let m = 1; m < tempNepaliDate.month; m++) {
          totalDaysFromBaishakh1 += getDaysInNepaliMonth(2081, m);
        }
        totalDaysFromBaishakh1 -= 365;
      }
    }
    
    const baishakh1_2082 = new Date(2025, 3, 14);
    firstDayEnglish = new Date(baishakh1_2082.getTime() + totalDaysFromBaishakh1 * 24 * 60 * 60 * 1000);
    const firstDayOfWeek = firstDayEnglish.getDay();
    
    const days: CalendarDay[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: null, isEmpty: true });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = attendanceDates.find((attendance) => {
        console.log("attendance", attendance);
        const attDate = new Date(attendance.date);
        console.log("attDate", attDate);
        if (isNaN(attDate.getTime())) {
          console.warn("Invalid attendance date:", attendance.date);
          return false;
        }
        const nepaliAttDate = englishToNepali(attDate);
        console.log("nepaliAttDate", nepaliAttDate);
        return nepaliAttDate.year === nepaliDate.year && 
               nepaliAttDate.month === nepaliDate.month && 
               nepaliAttDate.day === day;
      });
      let englishDate = '';
      if (attendance) {
        console.log("attendance found", attendance);
        const attDate = new Date(attendance.date);
        englishDate = attDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      days.push({
        day,
        nepaliDay: toNepaliNumber(day),
        englishDate: attendance ? englishDate : undefined,
        attendance,
        isEmpty: false
      });
    }
    console.log("calendarDays", days);
    setCalendarDays(days);
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    console.log("status", status);
    switch (status) {
      case AttendanceStatus.present:
        return '#4CAF50'; // Green
      case AttendanceStatus.absent:
        return '#F44336'; // Red
      case AttendanceStatus.late:
        return '#FF9800'; // Orange
      default:
        return 'transparent';
    }
  };

  const navigateMonth = (direction: number): void => {
    if (!currentNepaliDate) return;
    
    let newMonth = currentNepaliDate.month + direction;
    let newYear = currentNepaliDate.year;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    const newDate: NepaliDate = { ...currentNepaliDate, month: newMonth, year: newYear };
    setCurrentNepaliDate(newDate);
    generateCalendar(newDate);
  };

  if (!currentNepaliDate) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerText}>
          {nepaliMonths[currentNepaliDate.month - 1]} {toNepaliNumber(currentNepaliDate.year)}
        </Text>
        
        <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {nepaliDays.map((day: string, index: number) => (
          <View key={index} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.calendarScroll}>
        <View style={styles.calendar}>
          {calendarDays.map((dayData: CalendarDay, index: number) => (
            <View
              key={index}
              style={[
                styles.dayCell,
                dayData.isEmpty && styles.emptyCell,
                dayData.attendance && {
                  backgroundColor: getStatusColor(dayData.attendance.status)
                }
              ]}
            >
              {!dayData.isEmpty && dayData.nepaliDay && (
                <View style={styles.dayContent}>
                  <Text style={[
                    styles.dayText,
                    dayData.attendance && { color: '#ffffff' }
                  ]}>
                    {dayData.nepaliDay}
                  </Text>
                  {dayData.englishDate && (
                    <Text style={[
                      styles.englishDateText,
                      dayData.attendance && { color: '#ffffff' }
                    ]}>
                      {dayData.englishDate}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>हाजिरी स्थिति:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>उपस्थित</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>अनुपस्थित</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>ढिलो</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  calendarScroll: {
    maxHeight: 800,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  dayCell: {
    width: '12.6000%',
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    margin: 2,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  englishDateText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '400',
    marginTop: 2,
  },
  legend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default NepaliCalendar;