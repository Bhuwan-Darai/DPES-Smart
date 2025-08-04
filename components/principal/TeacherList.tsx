import React, { Component, ReactNode } from "react";
import {
  GET_SUBJECTS_QUERY,
  GET_TEACHERS_QUERY,
} from "@/lib/hooks/graphql/PrincipalQueries";
import { useQuery } from "@apollo/client";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import debounce from "lodash/debounce";
import { useRouter } from "expo-router";

interface SubjectData {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectVisible: boolean;
}

interface Filter {
  department: string;
  status: string;
  experience: string;
  searchQuery: string;
}

interface Teacher {
  personalInfoId: string;
  fullName: string;
  email: string | null;
  phone: string;
  gender: string;
  ethnicity: string | null;
  generatedId: string;
  profilePicture: string | null;
  department: string | null;
  joiningDate: string | null;
  experienceYear: number | null;
  teacherStatus: string;
  teacherStreetAddress: string;
  teacherCity: string;
  teacherState: string;
  teacherPinCode: string | null;
  teacherCountry: string | null;
  teacherAlternatePhone: string | null;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  qualification: string[];
  teacherEmergencyContactName: string | null;
  teacherEmergencyRelationship: string | null;
  teacherEmergencyContactPhone: string | null;
  teacherBio: string | null;
  bloodGroup: string | null;
  teacherClassAssignment: {
    ClassAssignId: string;
    class: string;
    classId: string;
    section: string;
    sectionId: string;
    subject: string;
    subjectId: string;
  }[];
  teacherPreviousExperience: {
    PerviousExperienceId: string;
    schoolName: string;
    position: string;
    fromyear: string;
    toyear: string;
    subjectTaught: string;
  }[];
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Teacher List Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            We're having trouble loading the teacher list. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Profile Picture Component
const ProfilePicture = ({
  uri,
  name,
  size = 48,
}: {
  uri: string | null;
  name: string;
  size?: number;
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!uri || imageError) {
    return (
      <View
        style={[
          styles.avatarPlaceholder,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[
        styles.profileImage,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onError={() => setImageError(true)}
    />
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status.toLowerCase() === "active";
  return (
    <View
      style={[
        styles.statusBadge,
        isActive ? styles.activeBadge : styles.inactiveBadge,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          isActive ? styles.activeDot : styles.inactiveDot,
        ]}
      />
      <Text
        style={[
          styles.statusText,
          isActive ? styles.activeText : styles.inactiveText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

// Main Teacher List Component
function TeacherListContent() {
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [filter, setFilter] = useState<Filter>({
    department: "All",
    status: "All",
    experience: "",
    searchQuery: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [teacherCount, setTeacherCount] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(filter.searchQuery);

  // Queries
  const { data: subjectDatas } = useQuery(GET_SUBJECTS_QUERY);
  const { data, loading, refetch, fetchMore } = useQuery(GET_TEACHERS_QUERY, {
    variables: {
      page: 1,
      limit: itemsPerPage,
      status: filter.status === "All" ? "All" : filter.status,
      subject: filter.department === "All" ? null : filter.department,
      searchQuery: debouncedSearch.trim() || null,
    },
    fetchPolicy: "network-only",
  });

  // Set subjects data to state
  useEffect(() => {
    if (subjectDatas?.subjects) {
      setSubjectsData(subjectDatas.subjects);
    }
  }, [subjectDatas]);

  // Set teachers data to state
  useEffect(() => {
    if (data?.getAllTeachers) {
      setTeachersData(data.getAllTeachers.teachers || []);
      setTeacherCount(data.getAllTeachers.totalCount || 0);
    }
  }, [data]);

  // Debounced refetch for search
  useEffect(() => {
    const debouncedUpdate = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500);

    debouncedUpdate(filter.searchQuery);
    return () => debouncedUpdate.cancel();
  }, [filter.searchQuery]);

  // Handle filter and search changes
  useEffect(() => {
    setCurrentPage(1);
    refetch({
      page: 1,
      limit: itemsPerPage,
      status: filter.status === "All" ? "All" : filter.status,
      subject: filter.department === "All" ? "All" : filter.department,
      searchQuery: debouncedSearch.trim() || "",
    });
  }, [filter, itemsPerPage, debouncedSearch]);

  // Handle infinite scroll
  const handleLoadMore = async () => {
    if (isFetchingMore || loading || teachersData.length >= teacherCount)
      return;

    setIsFetchingMore(true);
    const nextPage = currentPage + 1;

    try {
      const { data: newData } = await fetchMore({
        variables: {
          page: nextPage,
          limit: itemsPerPage,
          status: filter.status === "All" ? "All" : filter.status,
          subject: filter.department === "All" ? "All" : filter.department,
          searchQuery: filter.searchQuery.trim() || "",
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            getAllTeachers: {
              ...fetchMoreResult.getAllTeachers,
              teachers: [
                ...prev.getAllTeachers.teachers,
                ...fetchMoreResult.getAllTeachers.teachers,
              ],
            },
          };
        },
      });

      if (newData?.getAllTeachers?.teachers) {
        setTeachersData((prev) => [
          ...prev,
          ...newData.getAllTeachers.teachers,
        ]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching more teachers:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  if (loading && !isFetchingMore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading teachers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.header}>
        <Text style={styles.headerSubtitle}>{teacherCount} total teachers</Text>
      </LinearGradient>

      <View style={styles.filtersContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="magnify"
            size={20}
            color="#6B7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teachers by name, email, ID, or subject..."
            placeholderTextColor="#9CA3AF"
            value={filter.searchQuery}
            onChangeText={(text) => setFilter({ ...filter, searchQuery: text })}
            returnKeyType="search"
          />
          {filter.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setFilter({ ...filter, searchQuery: "" })}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Subject</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filter.department}
                onValueChange={(value) => {
                  setFilter({ ...filter, department: value });
                }}
                style={styles.picker}
                dropdownIconColor="#6366F1"
              >
                <Picker.Item label="All Subjects" value="All" />
                {subjectsData.map((sub) => (
                  <Picker.Item
                    key={sub.subjectId}
                    label={sub.subjectName}
                    value={sub.subjectId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterWrapper}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filter.status}
                onValueChange={(value) => {
                  setFilter({ ...filter, status: value });
                }}
                style={styles.picker}
                dropdownIconColor="#6366F1"
              >
                <Picker.Item label="All Status" value="All" />
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Inactive" value="inactive" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading teachers...</Text>
        </View>
      ) : (
        <TeacherView
          teachersData={teachersData}
          searchQuery={filter.searchQuery}
          isFetchingMore={isFetchingMore}
          onLoadMore={handleLoadMore}
        />
      )}
    </View>
  );
}

const TeacherView = ({
  teachersData,
  searchQuery,
  isFetchingMore,
  onLoadMore,
}: {
  teachersData: Teacher[];
  searchQuery: string;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}) => {
  const router = useRouter();
  const getDisplayedCount = () => {
    if (searchQuery.trim()) {
      return `${teachersData.length} result${
        teachersData.length !== 1 ? "s" : ""
      } found`;
    }
    return `${teachersData.length} teacher${
      teachersData.length !== 1 ? "s" : ""
    }`;
  };

  return (
    <View style={styles.teacherContainer}>
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>{getDisplayedCount()}</Text>
        </View>
      )}

      {teachersData.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name={searchQuery.trim() ? "magnify" : "account-group"}
            size={64}
            color="#9CA3AF"
          />
          <Text style={styles.emptyStateTitle}>
            {searchQuery.trim()
              ? "No matching teachers found"
              : "No teachers found"}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchQuery.trim()
              ? `No teachers match "${searchQuery}". Try a different search term.`
              : "Try adjusting your filters or check back later"}
          </Text>
        </View>
      ) : (
        <FlashList
          data={teachersData}
          estimatedItemSize={120}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.teacherCard}
              onPress={() =>
                router.push({
                  pathname: "/(principalScreen)/teacherList/[id]",
                  params: {
                    id: item.personalInfoId,
                    details: JSON.stringify(item),
                  },
                })
              }
            >
              <View style={styles.teacherHeader}>
                <View style={styles.teacherBasicInfo}>
                  <ProfilePicture
                    uri={item.profilePicture}
                    name={item.fullName}
                    size={56}
                  />
                  <View style={styles.teacherNameContainer}>
                    <Text style={styles.teacherName}>{item.fullName}</Text>
                    <Text style={styles.teacherEmail}>
                      {item.email || "No email"}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={item.teacherStatus} />
              </View>

              <View style={styles.teacherDetails}>
                <View style={styles.detailRow}>
                  <Icon name="book-open-variant" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.teacherClassAssignment.length > 0
                      ? item.teacherClassAssignment
                          .map((assignment) => assignment.subject)
                          .join(", ")
                      : "No subjects assigned"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="google-classroom" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.teacherClassAssignment.length > 0
                      ? item.teacherClassAssignment
                          .map(
                            (assignment) =>
                              `${assignment.class} (${assignment.section})`
                          )
                          .join(", ")
                      : "No classes assigned"}
                  </Text>
                </View>

                {item.experienceYear && (
                  <View style={styles.detailRow}>
                    <Icon name="clock-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {item.experienceYear} year
                      {item.experienceYear > 1 ? "s" : ""} experience
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.personalInfoId}
        />
      )}
    </View>
  );
};

// Wrapped component with Error Boundary
export default function TeacherList() {
  return (
    <ErrorBoundary>
      <TeacherListContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    opacity: 0.9,
  },
  filtersContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterWrapper: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  picker: {
    height: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#374151",
  },
  clearButton: {
    padding: 4,
  },
  searchResultsHeader: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchResultsText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  teacherContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teacherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  teacherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teacherBasicInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  teacherNameContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  teacherEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
  },
  inactiveBadge: {
    backgroundColor: "#FEF2F2",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: "#16A34A",
  },
  inactiveDot: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  activeText: {
    color: "#16A34A",
  },
  inactiveText: {
    color: "#EF4444",
  },
  teacherDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F8FAFC",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
