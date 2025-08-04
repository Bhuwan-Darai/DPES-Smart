import React, { useState, useEffect, ReactNode } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useQuery, DocumentNode } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useDebounce from "@/lib/debounce";
import {
  GET_CLASS_LIST,
  GET_GROUP_LIST,
  GET_SECTION_LIST,
  GET_STUDENTS,
} from "@/lib/hooks/graphql/PrincipalQueries";
import { useRouter } from "expo-router";

interface ClassData {
  classId: string;
  className: string;
}

interface SectionData {
  sectionId: string;
  sectionName: string;
}

interface GroupData {
  groupId: string;
  groupName: string;
  groupType: string;
}

interface Filter {
  class: string;
  section: string;
  group: string;
}

interface Student {
  studentId: string;
  studentGeneratedId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  dateOfBirthAD: string | null;
  dateOfBirthBS: string | null;
  gender: string;
  phone: string;
  temporaryAddress: { street: string | null } | null;
  studentClass: { className: string; classId: string } | null;
  studentSection: { sectionName: string; sectionId: string } | null;
  studentGroup: { groupName: string; groupId: string } | null;
  rollNumber: string;
  status: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Custom hook for managing filters and lists
const useFilterLists = (
  classQuery: DocumentNode,
  sectionQuery: DocumentNode,
  groupQuery: DocumentNode,
  filter: Filter,
  refetchSections: (variables: { classId: string }) => void,
  refetchGroups: (variables: { classId: string }) => void
) => {
  const [classListData, setClassListData] = useState<ClassData[]>([]);
  const [sectionListData, setSectionListData] = useState<SectionData[]>([]);
  const [groupListData, setGroupListData] = useState<GroupData[]>([]);

  const {
    data: classList,
    loading: classLoading,
    error: classError,
  } = useQuery(classQuery, {
    fetchPolicy: "network-only",
  });

  const {
    data: sectionList,
    loading: sectionLoading,
    error: sectionError,
  } = useQuery(sectionQuery, {
    variables: { classId: filter.class },
    skip: !filter.class,
    fetchPolicy: "network-only",
  });

  const {
    data: groupList,
    loading: groupLoading,
    error: groupError,
  } = useQuery(groupQuery, {
    variables: { classId: filter.class },
    skip: !filter.class,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (classList?.classrooms) {
      setClassListData(classList.classrooms);
    }
  }, [classList]);

  useEffect(() => {
    setSectionListData(sectionList?.sectionsByClassId || []);
  }, [sectionList, filter.class]);

  useEffect(() => {
    setGroupListData(groupList?.groupsByClassId || []);
  }, [groupList, filter.class]);

  useEffect(() => {
    if (filter.class) {
      refetchSections({ classId: filter.class });
      refetchGroups({ classId: filter.class });
    }
  }, [filter.class, refetchSections, refetchGroups]);

  return {
    classListData,
    sectionListData,
    groupListData,
    classLoading,
    sectionLoading,
    groupLoading,
    classError,
    sectionError,
    groupError,
  };
};

// Custom hook for managing students data
const useStudentsData = (
  studentsQuery: DocumentNode,
  filter: Filter,
  debouncedSearchQuery: string,
  itemsPerPage: number
) => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const {
    data: students,
    loading: studentsLoading,
    fetchMore,
    refetch: refetchStudents,
  } = useQuery(studentsQuery, {
    variables: {
      page: 1,
      limit: itemsPerPage,
      searchQuery: debouncedSearchQuery,
      filters: {
        class: filter.class || undefined,
        section: filter.section || undefined,
        group: filter.group || undefined,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (students?.GetStudents?.students) {
      setStudentsData(students.GetStudents.students || []);
      setTotalCount(students.GetStudents.total || 0);
    }
  }, [students?.GetStudents?.students, filter.class]);

  useEffect(() => {
    setCurrentPage(1);
    setStudentsData([]);
    refetchStudents({
      page: 1,
      limit: itemsPerPage,
      searchQuery: debouncedSearchQuery.trim(),
      filters: {
        class: filter.class || undefined,
        section: filter.section || undefined,
        group: filter.group || undefined,
      },
    });
  }, [
    filter.class,
    filter.section,
    filter.group,
    debouncedSearchQuery,
    refetchStudents,
  ]);

  const handleLoadMore = async () => {
    if (
      isFetchingMore ||
      studentsLoading ||
      studentsData.length >= totalCount
    ) {
      return;
    }

    setIsFetchingMore(true);
    const nextPage = currentPage + 1;

    try {
      const { data: newData } = await fetchMore({
        variables: {
          page: nextPage,
          limit: itemsPerPage,
          searchQuery: debouncedSearchQuery.trim(),
          filters: {
            class: filter.class || undefined,
            section: filter.section || undefined,
            group: filter.group || undefined,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            GetStudents: {
              ...fetchMoreResult.GetStudents,
              students: [
                ...prev.GetStudents.students,
                ...fetchMoreResult.GetStudents.students.filter(
                  (newStudent: Student) =>
                    !prev.GetStudents.students.some(
                      (existing: Student) =>
                        existing.studentId === newStudent.studentId
                    )
                ),
              ],
            },
          };
        },
      });

      if (newData?.GetStudents?.students) {
        setStudentsData((prev) => [
          ...prev,
          ...newData.GetStudents.students.filter(
            (newStudent: Student) =>
              !prev.some(
                (existing) => existing.studentId === newStudent.studentId
              )
          ),
        ]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching more students:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  return {
    studentsData,
    totalCount,
    isFetchingMore,
    handleLoadMore,
    studentsLoading,
  };
};

// ErrorBoundary as a functional component
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const handleError = (error: Error, errorInfo: any) => {
    console.error("Student List Error:", error, errorInfo);
    setErrorState({ hasError: true, error });
  };

  if (errorState.hasError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          We're having trouble loading the student list. Please try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setErrorState({ hasError: false, error: null })}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ErrorBoundaryWrapper onError={handleError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

// Wrapper to catch errors in functional component
export const ErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  onError: (error: Error, errorInfo: any) => void;
}> = ({ children, onError }) => {
  try {
    return <>{children}</>;
  } catch (error: any) {
    onError(error, {});
    return null;
  }
};

// ProfilePicture component
const ProfilePicture: React.FC<{
  uri: string | null;
  name: string;
  size?: number;
}> = ({ uri, name, size = 48 }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

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

// StatusBadge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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

// StudentView component
const StudentView: React.FC<{
  studentsData: Student[];
  searchQuery: string;
  isFetchingMore: boolean;
  studentsLoading: boolean;
  onLoadMore: () => void;
}> = ({
  studentsData,
  searchQuery,
  isFetchingMore,
  studentsLoading,
  onLoadMore,
}) => {
  const router = useRouter();
  const getDisplayedCount = () =>
    searchQuery.trim()
      ? `${studentsData.length} result${
          studentsData.length !== 1 ? "s" : ""
        } found`
      : `${studentsData.length} student${studentsData.length !== 1 ? "s" : ""}`;

  if (studentsLoading && !isFetchingMore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={styles.studentContainer}>
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>{getDisplayedCount()}</Text>
        </View>
      )}

      {studentsData.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name={searchQuery.trim() ? "magnify" : "account-group"}
            size={64}
            color="#9CA3AF"
          />
          <Text style={styles.emptyStateTitle}>
            {searchQuery.trim()
              ? "No matching students found"
              : "No students found"}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchQuery.trim()
              ? `No students match "${searchQuery}". Try a different search term.`
              : "Try adjusting your filters or check back later"}
          </Text>
        </View>
      ) : (
        <FlashList
          data={studentsData}
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
              style={styles.studentCard}
              onPress={() => {
                router.push({
                  pathname: "/(principalScreen)/studentList/[id]",
                  params: { id: item.studentId, details: JSON.stringify(item) },
                });
              }}
            >
              <View style={styles.studentHeader}>
                <View style={styles.studentBasicInfo}>
                  <ProfilePicture
                    uri={null}
                    name={`${item.firstName} ${item.lastName}`}
                    size={56}
                  />
                  <View style={styles.studentNameContainer}>
                    <Text style={styles.studentName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.studentEmail}>
                      {item.email || "No email"}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.studentDetails}>
                <View style={styles.detailRow}>
                  <Icon name="book-open-variant" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.studentClass?.className || "No class assigned"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="google-classroom" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.studentSection?.sectionName || "No section assigned"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="account-group" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.studentGroup?.groupName || "No group assigned"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.studentId}
        />
      )}
    </View>
  );
};

// Main StudentList component
const StudentList: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({
    class: "",
    section: "",
    group: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const itemsPerPage = 10;

  const { data: sectionList, refetch: refetchSections } = useQuery(
    GET_SECTION_LIST,
    {
      variables: { classId: filter.class },
      skip: !filter.class,
    }
  );
  const { data: groupList, refetch: refetchGroups } = useQuery(GET_GROUP_LIST, {
    variables: { classId: filter.class },
    skip: !filter.class,
  });

  const {
    classListData,
    sectionListData,
    groupListData,
    classLoading,
    sectionLoading,
    groupLoading,
  } = useFilterLists(
    GET_CLASS_LIST,
    GET_SECTION_LIST,
    GET_GROUP_LIST,
    filter,
    refetchSections,
    refetchGroups
  );

  const {
    studentsData,
    totalCount,
    isFetchingMore,
    handleLoadMore,
    studentsLoading,
  } = useStudentsData(GET_STUDENTS, filter, debouncedSearchQuery, itemsPerPage);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.header}>
          <Text style={styles.headerSubtitle}>{totalCount} total students</Text>
        </LinearGradient>

        <View style={styles.filtersContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon
              name="magnify"
              size={18}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills Container */}
          <View style={styles.filtersGrid}>
            {/* Class Filter */}
            <View style={styles.filterPill}>
              <Text style={styles.filterLabel}>Class</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filter.class}
                  onValueChange={(value) =>
                    setFilter({
                      ...filter,
                      class: value,
                      section: "",
                      group: "",
                    })
                  }
                  style={styles.picker}
                  dropdownIconColor="#6366F1"
                  enabled={!classLoading}
                >
                  <Picker.Item label="All" value="" />
                  {classListData.map((cls) => (
                    <Picker.Item
                      key={cls.classId}
                      label={cls.className}
                      value={cls.classId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Section Filter */}
            <View style={styles.filterPill}>
              <Text style={styles.filterLabel}>Section</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filter.section}
                  onValueChange={(value) =>
                    setFilter({ ...filter, section: value })
                  }
                  style={styles.picker}
                  dropdownIconColor="#6366F1"
                  enabled={!sectionLoading && sectionListData.length > 0}
                >
                  <Picker.Item label="All" value="" />
                  {sectionListData.map((section) => (
                    <Picker.Item
                      key={section.sectionId}
                      label={section.sectionName}
                      value={section.sectionId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Group Filter */}
            <View style={styles.filterPill}>
              <Text style={styles.filterLabel}>Group</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filter.group}
                  onValueChange={(value) =>
                    setFilter({ ...filter, group: value })
                  }
                  style={styles.picker}
                  dropdownIconColor="#6366F1"
                  enabled={!groupLoading && groupListData.length > 0}
                >
                  <Picker.Item label="All" value="" />
                  {groupListData.map((group) => (
                    <Picker.Item
                      key={group.groupId}
                      label={group.groupName}
                      value={group.groupId}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <StudentView
          studentsData={studentsData}
          searchQuery={searchQuery}
          isFetchingMore={isFetchingMore}
          studentsLoading={studentsLoading}
          onLoadMore={handleLoadMore}
        />
      </View>
    </ErrorBoundary>
  );
};

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
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 48,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "400",
  },

  clearButton: {
    padding: 4,
    marginLeft: 8,
  },

  filtersGrid: {
    flexDirection: "row",
    gap: 12,
  },

  filterPill: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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

  searchResultsHeader: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginBottom: 8,
  },

  searchResultsText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  studentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  studentBasicInfo: {
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
  studentNameContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  studentEmail: {
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
  studentDetails: {
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

export default StudentList;
