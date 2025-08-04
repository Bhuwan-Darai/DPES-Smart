import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SCHOOL_LOCATION,
  GET_TEACHER_SCHEDULE_QUERY,
  MARK_TEACHER_ATTENDANCE_MUTATION,
} from "@/lib/hooks/graphql/TeacherQueries";

const REQUIRED_DISTANCE = 500; // meters

const ATTENDANCE_DONE_PREFIX = "ATTENDANCE_DONE_";
const TEACHER_SCHEDULE_KEY = "TEACHER_SCHEDULE";

// Helper: Get today's date string (yyyy-mm-dd)
const getTodayString = () => new Date().toISOString().split("T")[0];

// Helper: Clean up old attendance keys
const cleanOldAttendanceKeys = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const now = new Date();
  for (const key of keys) {
    if (key.startsWith(ATTENDANCE_DONE_PREFIX)) {
      const dateStr = key.replace(ATTENDANCE_DONE_PREFIX, "");
      const date = new Date(dateStr);
      if ((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) > 3) {
        await AsyncStorage.removeItem(key);
      }
    }
  }
};

const TakeTeacherAttendance = () => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    punchIn: false,
    punchOut: false,
  });

  const [institutionCoordinates, setInstitutionCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Query to get the school location from the super admin
  const {
    data,
    loading: schoolLocationLoading,
    error: schoolLocationError,
  } = useQuery(GET_SCHOOL_LOCATION, {
    fetchPolicy: "network-only",
  });

  console.log(JSON.stringify(data, null, 2), "schoolLocation");
  console.log(
    JSON.stringify(schoolLocationError, null, 2),
    "schoolLocationError"
  );

  const { data: teacherScheduleData, loading: teacherScheduleLoading } =
    useQuery(GET_TEACHER_SCHEDULE_QUERY, {
      fetchPolicy: "network-only",
    });

  console.log(
    JSON.stringify(teacherScheduleData, null, 2),
    "teacherScheduleError"
  );

  // mutation to update the attendance
  const [updateAttendance] = useMutation(MARK_TEACHER_ATTENDANCE_MUTATION);

  console.log(JSON.stringify(data, null, 2), "schoolLocation");
  console.log(
    JSON.stringify(schoolLocationError, null, 2),
    "schoolLocationError"
  );

  // useEffect to set the institution coordinates from the super admin
  useEffect(() => {
    if (
      data?.getSchoolLocation &&
      Array.isArray(data.getSchoolLocation.schoolLocation)
    ) {
      const [latitude, longitude] = data.getSchoolLocation.schoolLocation;
      setInstitutionCoordinates({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    }
  }, [data]);

  // On mount: check schedule, attendance, and schedule notifications if needed
  useEffect(() => {
    const setupAttendanceReminder = async () => {
      await cleanOldAttendanceKeys();
      if (!teacherScheduleData?.getTeacherSchedule) return;
      const schedule = teacherScheduleData.getTeacherSchedule;
      await AsyncStorage.setItem(
        TEACHER_SCHEDULE_KEY,
        JSON.stringify(schedule)
      );
      const today = new Date();
      const todayStr = getTodayString();
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      const weekday = today.getDay();
      const isScheduledDay = schedule.days.includes(weekday);
      const isInRange = today >= start && today <= end;
      const attendanceDone = await AsyncStorage.getItem(
        ATTENDANCE_DONE_PREFIX + todayStr
      );
      if (isInRange && isScheduledDay && attendanceDone !== "true") {
        // Parse comingTime and leavingTime to today
        const coming = new Date(schedule.comingTime);
        const leaving = new Date(schedule.leavingTime);
        const punchInTrigger = new Date(today);
        punchInTrigger.setHours(
          coming.getUTCHours(),
          coming.getUTCMinutes(),
          0,
          0
        );
        const punchOutTrigger = new Date(today);
        punchOutTrigger.setHours(
          leaving.getUTCHours(),
          leaving.getUTCMinutes(),
          0,
          0
        );
        // If time already passed, don't schedule
        // if (punchInTrigger > today) {
        // await scheduleAttendanceNotification(
        //   schedule.teacherName,
        //   punchInTrigger,
        //   "punch-in"
        // );
        // }
        // if (punchOutTrigger > today) {
        // await scheduleAttendanceNotification(
        //   schedule.teacherName,
        //   punchOutTrigger,
        //   "punch-out"
        // );
        // }
      }
    };
    setupAttendanceReminder();
  }, [teacherScheduleData]);

  // useEffect to check the location permission and today's attendance
  useEffect(() => {
    checkLocationPermission();
    checkTodayAttendance();
  }, []);

  // Function to check the location permission
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to mark attendance"
        );
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  // Function to get the current location
  const getCurrentLocation = async () => {
    setLoading(true);
    setLocationStatus("Getting your location...");

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // FAKE LOCATION FOR TESTING
      // const latitude = 28.213248;
      // const longitude = 83.9974912;
      // setUserLocation({ latitude, longitude });

      if (!institutionCoordinates) {
        setLocationStatus("Institution coordinates not available.");
        setIsWithinRange(false);
        setLoading(false);
        return;
      }

      const distance = calculateDistance(
        latitude,
        longitude,
        institutionCoordinates.latitude,
        institutionCoordinates.longitude
      );

      if (distance <= REQUIRED_DISTANCE) {
        setIsWithinRange(true);
        setLocationStatus(
          `✓ Location verified (${Math.round(distance)}m from office)`
        );
      } else {
        setIsWithinRange(false);
        setLocationStatus(
          `✗ You are ${Math.round(
            distance
          )}m away. You must be within ${REQUIRED_DISTANCE}m to mark attendance.`
        );
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationStatus("Failed to get location. Please try again.");
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please check your GPS settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate the distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to check the today's attendance
  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toDateString();
      const attendanceData = await AsyncStorage.getItem("attendanceRecords");
      if (attendanceData) {
        const records = JSON.parse(attendanceData);
        const todayRecord = records.find(
          (record: any) => record.date === today
        );
        if (todayRecord) {
          setAttendanceStatus({
            punchIn: !!todayRecord.punchInTime,
            punchOut: !!todayRecord.punchOutTime,
          });
        }
      }
    } catch (error) {
      console.error("Error checking today attendance:", error);
    }
  };

  // Function to mark the attendance
  const markAttendance = async (type: "punch-in" | "punch-out") => {
    if (!isWithinRange) {
      Alert.alert(
        "Location Error",
        "You are not at the required location to mark attendance."
      );
      return;
    }

    if (type === "punch-out" && !attendanceStatus.punchIn) {
      Alert.alert("Error", "You must punch in before you can punch out.");
      return;
    }

    try {
      setLoading(true);
      const today = new Date();
      const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD
      const timestamp = today.toISOString();
      const input: any = {
        teacherId: userDetails?.id,
        date: dateString,
        status: "present", // Let backend auto-calculate late/left if needed
      };
      if (type === "punch-in") {
        input.punchInTime = timestamp;
      } else {
        input.punchOutTime = timestamp;
      }

      const { data: mutationData, errors } = await updateAttendance({
        variables: { input },
      });

      if (mutationData?.markAttendanceByTeacher?.success) {
        setAttendanceStatus((prev) => ({
          ...prev,
          [type === "punch-in" ? "punchIn" : "punchOut"]: true,
        }));
        // Store attendance in AsyncStorage
        const attendanceData = await AsyncStorage.getItem("attendanceRecords");
        let records = attendanceData ? JSON.parse(attendanceData) : [];
        let todayRecord = records.find(
          (record: any) => record.date === dateString
        );
        if (!todayRecord) {
          todayRecord = {
            userId: userDetails?.id,
            date: dateString,
            punchInTime: type === "punch-in" ? timestamp : null,
            punchOutTime: type === "punch-out" ? timestamp : null,
          };
          records.push(todayRecord);
        } else {
          todayRecord = {
            ...todayRecord,
            [type === "punch-in" ? "punchInTime" : "punchOutTime"]: timestamp,
          };
          records = records.map((record: any) =>
            record.date === dateString ? todayRecord : record
          );
        }
        await AsyncStorage.setItem(
          "attendanceRecords",
          JSON.stringify(records)
        );
        // Mark attendance done for today and cancel notifications
        await AsyncStorage.setItem(ATTENDANCE_DONE_PREFIX + dateString, "true");
        Alert.alert(
          "Success",
          `${
            type === "punch-in" ? "Punch In" : "Punch Out"
          } marked successfully!`
        );
      } else {
        Alert.alert(
          "Error",
          mutationData?.markAttendanceByTeacher?.message ||
            `Failed to mark ${type} attendance. Please try again.`
        );
      }
    } catch (error: any) {
      console.error(`Error marking ${type} attendance:`, error);
      Alert.alert(
        "Error",
        error?.message || `Failed to mark ${type} attendance. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Location Verification</Text>
        <Text style={styles.sectionTitle}>
          My location: {userLocation?.latitude}, {userLocation?.longitude}
        </Text>

        <Text style={styles.sectionTitle}>
          Institution location: {institutionCoordinates?.latitude},{" "}
          {institutionCoordinates?.longitude}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Verifying location...</Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                isWithinRange ? styles.successText : styles.errorText,
              ]}
            >
              {locationStatus}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.attendanceSection}>
        {attendanceStatus.punchIn && attendanceStatus.punchOut ? (
          <View style={styles.alreadyMarkedContainer}>
            <Text style={styles.alreadyMarkedText}>
              ✓ Both Punch In and Punch Out marked for today
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.markAttendanceButton,
                (!isWithinRange || loading || attendanceStatus.punchIn) &&
                  styles.disabledButton,
              ]}
              onPress={() => markAttendance("punch-in")}
              disabled={!isWithinRange || loading || attendanceStatus.punchIn}
            >
              <Text style={styles.markAttendanceButtonText}>Punch In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.markAttendanceButton,
                (!isWithinRange ||
                  loading ||
                  attendanceStatus.punchOut ||
                  !attendanceStatus.punchIn) &&
                  styles.disabledButton,
              ]}
              onPress={() => markAttendance("punch-out")}
              disabled={
                !isWithinRange ||
                loading ||
                attendanceStatus.punchOut ||
                !attendanceStatus.punchIn
              }
            >
              <Text style={styles.markAttendanceButtonText}>Punch Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  locationSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 22,
  },
  successText: {
    color: "#4CAF50",
  },
  errorText: {
    color: "#F44336",
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  attendanceSection: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  alreadyMarkedContainer: {
    backgroundColor: "#E8F5E8",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  alreadyMarkedText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  markAttendanceButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  markAttendanceButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TakeTeacherAttendance;
