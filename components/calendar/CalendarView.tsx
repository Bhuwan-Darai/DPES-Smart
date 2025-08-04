import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Calendar, Clock, FileText, MapPin, Tag } from "lucide-react-native";
import { useQuery } from "@apollo/client";
import { GET_ACADEMIC_YEARS, GET_CALENDAR_EVENTS } from "./calendar-graphql";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const YEARS = Array.from({ length: 28 }, (_, i) => String(2023 + i));
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Event {
  eventId: string;
  title: string;
  eventTypeId: string;
  eventCategoryId: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  eventTypeColorCode: string;
  eventTypeName: string;
  eventCategoryName: string;
  academicYearId: string;
  academicYear: string;
  status: string;
}

interface AcademicYear {
  academicYearId: string;
  academicYear: string;
  startDateAD: string;
}

const CalendarView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const { data, refetch, loading } = useQuery(GET_CALENDAR_EVENTS, {
    variables: {
      currentPage,
      pageSize: itemsPerPage,
      searchQuery: "",
    },
  });

  const { data: academicYearsData, loading: academicYearsLoading } =
    useQuery(GET_ACADEMIC_YEARS);

  useEffect(() => {
    if (academicYearsData?.getAcademicYears) {
      setAcademicYears(academicYearsData.getAcademicYears.data);
    }
  }, [academicYearsData?.getAcademicYears]);

  console.log(academicYears, "academicYears");

  const selectedAcademicYear = academicYears.find(
    (year) =>
      `${new Date(year.startDateAD).getFullYear()} (${year.academicYear})` ===
      selectedYear
  );

  const filteredEvents: Event[] = selectedAcademicYear
    ? (data?.calanderEvents?.calanderEvent || []).filter(
        (event: Event) =>
          event.academicYearId === selectedAcademicYear.academicYearId
      )
    : [];

  const events: Event[] = data?.calanderEvents?.calanderEvent || [];

  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage, selectedYear, selectedMonth, refetch]);

  const getCalendarDays = () => {
    const selectedAcademicYear = academicYears.find(
      (year) =>
        `${new Date(year.startDateAD).getFullYear()} (${year.academicYear})` ===
        selectedYear
    );
    const year = selectedAcademicYear
      ? new Date(selectedAcademicYear.startDateAD).getFullYear()
      : new Date().getFullYear();
    const month = MONTHS.indexOf(selectedMonth);
    const start = startOfWeek(startOfMonth(new Date(year, month)));
    const end = endOfWeek(endOfMonth(new Date(year, month)));
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event: Event) => {
      const eventDate = new Date(parseInt(event.startDate));
      return isSameDay(eventDate, date);
    });
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderEvent = (event: Event) => (
    <TouchableOpacity
      key={event.eventId}
      style={[
        styles.eventContainer,
        {
          backgroundColor: `${event.eventTypeColorCode}15`,
          borderLeftColor: event.eventTypeColorCode,
        },
      ]}
      onPress={() => handleEventPress(event)}
    >
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.eventStatus}>{event.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEventModal = () => {
    if (!selectedEvent) return null;

    return (
      <RNModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.eventDetailsContainer}>
                <View style={styles.eventDetailRow}>
                  <Clock
                    size={16}
                    color={selectedEvent.eventTypeColorCode}
                    style={styles.eventDetailIcon}
                  />
                  <View>
                    <Text style={styles.eventDetailLabel}>Date & Time</Text>
                    <Text style={styles.eventDetailValue}>
                      {format(
                        new Date(parseInt(selectedEvent.startDate)),
                        "PPP 'at' HH:mm"
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventDetailRow}>
                  <Tag
                    size={16}
                    color={selectedEvent.eventTypeColorCode}
                    style={styles.eventDetailIcon}
                  />
                  <View>
                    <Text style={styles.eventDetailLabel}>Type</Text>
                    <Text style={styles.eventDetailValue}>
                      {selectedEvent.eventTypeName}
                    </Text>
                  </View>
                </View>
                {selectedEvent.location && (
                  <View style={styles.eventDetailRow}>
                    <MapPin
                      size={16}
                      color={selectedEvent.eventTypeColorCode}
                      style={styles.eventDetailIcon}
                    />
                    <View>
                      <Text style={styles.eventDetailLabel}>Location</Text>
                      <Text style={styles.eventDetailValue}>
                        {selectedEvent.location}
                      </Text>
                    </View>
                  </View>
                )}
                {selectedEvent.description && (
                  <View style={styles.eventDetailRow}>
                    <FileText
                      size={16}
                      color={selectedEvent.eventTypeColorCode}
                      style={styles.eventDetailIcon}
                    />
                    <View>
                      <Text style={styles.eventDetailLabel}>Description</Text>
                      <Text style={styles.eventDetailValue}>
                        {selectedEvent.description}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.eventDetailRow}>
                  <Tag
                    size={16}
                    color={selectedEvent.eventTypeColorCode}
                    style={styles.eventDetailIcon}
                  />
                  <View>
                    <Text style={styles.eventDetailLabel}>Category</Text>
                    <Text style={styles.eventDetailValue}>
                      {selectedEvent.eventCategoryName}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventDetailRow}>
                  <Calendar
                    size={16}
                    color={selectedEvent.eventTypeColorCode}
                    style={styles.eventDetailIcon}
                  />
                  <View>
                    <Text style={styles.eventDetailLabel}>Academic Year</Text>
                    <Text style={styles.eventDetailValue}>
                      {selectedEvent.academicYear}
                    </Text>
                  </View>
                </View>
                <View style={styles.eventDetailRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: selectedEvent.eventTypeColorCode },
                    ]}
                  />
                  <View>
                    <Text style={styles.eventDetailLabel}>Status</Text>
                    <Text style={styles.eventDetailValue}>
                      {selectedEvent.status}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </RNModal>
    );
  };

  const calendarDays = getCalendarDays();

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      )}
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={setSelectedYear}
          value={selectedYear}
          items={academicYears.map((year) => {
            const label = `${new Date(year.startDateAD).getFullYear()} (${
              year.academicYear
            })`;
            return { label, value: label };
          })}
          style={pickerStyles}
          placeholder={{ label: "Select year", value: null }}
        />
        <RNPickerSelect
          onValueChange={setSelectedMonth}
          value={selectedMonth}
          items={MONTHS.map((month) => ({ label: month, value: month }))}
          style={pickerStyles}
          placeholder={{ label: "Select month", value: null }}
        />
      </View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>
      <ScrollView>
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <View key={index} style={styles.dayCell}>
              <Text style={styles.dayNumber}>{format(day, "d")}</Text>
              {getEventsForDate(day).map(renderEvent)}
            </View>
          ))}
        </View>
      </ScrollView>
      {renderEventModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    minHeight: 100,
    padding: 4,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  dayNumber: {
    textAlign: "center",
    color: "#333",
    fontSize: 14,
    marginBottom: 4,
  },
  eventContainer: {
    marginTop: 4,
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 12, fontWeight: "500", color: "#333" },
  eventStatus: { fontSize: 10, color: "#666", marginTop: 2 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(251, 251, 251, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
  },
  eventDetailsContainer: {
    padding: 16,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  eventDetailIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  eventDetailLabel: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
  },
  eventDetailValue: {
    fontSize: 12,
    color: "#333",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 4,
  },
});

const pickerStyles = {
  inputIOS: {
    width: 140,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
  inputAndroid: {
    width: 140,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
};

export default CalendarView;
