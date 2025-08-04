import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Calendar,
  Filter,
  Search,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Clock1,
} from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@apollo/client";
import { GET_PAGINATED_TEACHER_ATTENDANCE } from "@/lib/hooks/graphql/PrincipalQueries";
import useDebounce from "@/lib/debounce";

// TypeScript interfaces
interface Attendance {
  status: "present" | "absent" | "Not done yet";
  attendanceDate: string | null;
  attendanceId: string | null;
}

interface Teacher {
  id: string;
  name: string;
  customId: string;
  photo: string;
  date: string | null;
  attendance?: Attendance | null; // Allow attendance to be optional
}

const TeacherAttendanceUI: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "Not done yet"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const limit = 10;
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const {
    data,
    loading: queryLoading,
    error: queryError,
    fetchMore,
  } = useQuery(GET_PAGINATED_TEACHER_ATTENDANCE, {
    variables: {
      date: selectedDate.toISOString().split("T")[0],
      page: 1,
      limit,
      search: debouncedSearchQuery,
    },
    notifyOnNetworkStatusChange: true,
  });

  console.log(JSON.stringify(data, null, 2), "data");

  // Map API data to Teacher interface
  useEffect(() => {
    if (data?.getAllTeacherAttendanceForPrincipal) {
      setLoading(true);
      try {
        const mappedTeachers: Teacher[] =
          data.getAllTeacherAttendanceForPrincipal.map((item: any) => ({
            id: item.teacherId,
            name: item.fullName,
            customId: item.customId,
            photo: item.photo,
            attendance: item.attendance
              ? {
                  status:
                    item.attendance.status === "present"
                      ? "present"
                      : item.attendance.status === "absent"
                      ? "absent"
                      : "Not done yet",
                  attendanceDate: item.attendance.attendanceDate,
                  attendanceId: item.attendance.attendanceId,
                }
              : {
                  status: "Not done yet",
                  attendanceDate: null,
                  attendanceId: null,
                },
          }));
        console.log(mappedTeachers, "mappedTeachers");
        setTeachers(mappedTeachers);
        setHasMore(mappedTeachers.length === limit);
        setError(null);
      } catch (err) {
        setError("Failed to process teacher data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (queryError) {
      setError("Failed to load teachers. Please try again.");
      setLoading(false);
    }
  }, [data?.getAllTeacherAttendanceForPrincipal, queryError]);

  // Handle fetch more
  const handleFetchMore = useCallback(() => {
    if (!hasMore || queryLoading) return;
    fetchMore({
      variables: {
        page: page + 1,
        date: selectedDate.toISOString().split("T")[0],
        limit,
        search: debouncedSearchQuery,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllTeacherAttendanceForPrincipal) {
          setHasMore(false);
          return prev;
        }
        const newTeachers =
          fetchMoreResult.getAllTeacherAttendanceForPrincipal.map(
            (item: any) => ({
              id: item.teacherId,
              name: item.fullName,
              customId: item.customId,
              photo: item.photo,
              attendance: item.attendance
                ? {
                    status:
                      item.attendance.status === "present"
                        ? "present"
                        : item.attendance.status === "absent"
                        ? "absent"
                        : "Not done yet",
                    attendanceDate: item.attendance.attendanceDate,
                    attendanceId: item.attendance.attendanceId,
                  }
                : {
                    status: "Not done yet",
                    attendanceDate: null,
                    attendanceId: null,
                  },
            })
          );
        setTeachers((prevTeachers) => [...prevTeachers, ...newTeachers]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(newTeachers.length === limit);
        return {
          getAllTeacherAttendanceForPrincipal: [
            ...prev.getAllTeacherAttendanceForPrincipal,
            ...fetchMoreResult.getAllTeacherAttendanceForPrincipal,
          ],
        };
      },
    });
  }, [
    fetchMore,
    hasMore,
    page,
    queryLoading,
    selectedDate,
    debouncedSearchQuery,
  ]);

  // Filter teachers (only by status, as search and date are server-side)
  const filteredTeachers = useMemo(() => {
    if (statusFilter === "all") return teachers;
    return teachers.filter(
      (teacher) => teacher.attendance?.status === statusFilter
    );
  }, [teachers, statusFilter]);

  // Stats
  const presentCount = teachers.filter(
    (t) => t.attendance?.status === "present"
  ).length;
  const absentCount = teachers.filter(
    (t) => t.attendance?.status === "absent"
  ).length;
  const notDoneCount = teachers.filter(
    (t) => t.attendance?.status === "Not done yet"
  ).length;
  // Status icon and color helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle size={20} color="#10b981" />;
      case "absent":
        return <Clock1 size={20} color="#ef4444" />;
      case "Not done yet":
        return <Clock size={20} color="#6b7280" />;
      default:
        return <Clock size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "Not done yet":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setSelectedDate(new Date());
    setStatusFilter("all");
    setSearchQuery("");
    setPage(1);
    setTeachers([]);
    setHasMore(true);
  }, []);

  // Render item for FlashList
  const renderItem = ({ item }: { item: Teacher }) => (
    <View style={styles.teacherCard}>
      <View style={styles.teacherInfo}>
        <View style={styles.teacherNameContainer}>
          <User size={16} color="#6b7280" />
          <Text style={styles.teacherName}>{item.name}</Text>
        </View>
        <Text style={styles.teacherSubject}>{item.customId}</Text>
      </View>
      <View style={styles.teacherStatus}>
        <View style={styles.statusIcon}>
          {getStatusIcon(item.attendance?.status || "")}
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(
                item.attendance?.status || ""
              ).split(" ")[0],
            },
          ]}
        >
          <Text style={styles.statusText}>{item.attendance?.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          Track daily attendance for teaching staff
        </Text>
      </View>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{presentCount}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <CheckCircle size={24} color="#10b981" />
        </View>
        <View style={styles.statCard}>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{absentCount}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <XCircle size={24} color="#ef4444" />
        </View>
        <View style={styles.statCard}>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{notDoneCount}</Text>
            <Text style={styles.statLabel}>Not Done</Text>
          </View>
          <Clock size={24} color="#6b7280" />
        </View>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachers or IDs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          accessibilityLabel="Search teachers or IDs"
        />
      </View>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Date Filter */}
        <TouchableOpacity
          style={styles.dateFilter}
          onPress={() => setIsDatePickerOpen(true)}
          accessibilityLabel="Select date"
        >
          <Calendar size={20} color="#6b7280" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {isDatePickerOpen && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            timeZoneName="Asia/Kathmandu"
            onChange={(event, date) => {
              setIsDatePickerOpen(false);
              if (date) {
                setSelectedDate(date as Date);
                setPage(1);
                setTeachers([]);
                setHasMore(true);
              }
            }}
            is24Hour={false}
          />
        )}
        {/* Status Filter */}
        <View style={styles.statusFilter}>
          <Filter size={20} color="#6b7280" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["all", "present", "absent", "Not done yet"].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() =>
                  setStatusFilter(
                    status as "all" | "present" | "absent" | "Not done yet"
                  )
                }
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive,
                ]}
                accessibilityLabel={`Filter by ${status}`}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    statusFilter === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        accessibilityLabel="Refresh attendance data"
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      {/* Teachers List */}
      <FlashList
        data={filteredTeachers}
        renderItem={renderItem}
        keyExtractor={(item) => item.customId}
        estimatedItemSize={100}
        onEndReached={handleFetchMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading || queryLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <User size={48} color="#6b7280" />
              <Text style={styles.emptyText}>No teachers found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your filters
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          queryLoading && !loading ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statContent: {
    flexDirection: "column",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  dateFilter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  statusFilter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: "#e5e7eb",
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  refreshButton: {
    alignSelf: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  teacherCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    marginHorizontal: 2,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  teacherSubject: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  teacherStatus: {
    alignItems: "flex-end",
  },
  statusIcon: {
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
    textTransform: "capitalize",
  },
});

export default TeacherAttendanceUI;
