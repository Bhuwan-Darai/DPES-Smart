import React, { useState, ReactNode, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useStaffData from "./useStaffData";
import useDepartmentData from "./useDepartmentData";
import useDebounce from "@/lib/debounce";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouter } from "expo-router";

interface Filter {
  department: string;
  status: string;
}

interface DepartmentData {
  departmentId: string;
  name: string;
  designations: DesignationData[];
}

interface DesignationData {
  designationId: string;
  name: string;
}

interface StaffDesignationData {
  designationId: string;
  designationName: string;
}

interface StaffDepartmentData {
  departmentId: string | null;
  departmentName: string | null;
}

interface StaffData {
  staffId: string;
  customId: string;
  fullName: string;
  email: string;
  phone: string;
  department: StaffDepartmentData | null;
  status: string;
  photo: string | null;
  roleOrPosition: StaffDesignationData | null;
  yearOfExperience: string | null;
  joiningDate: string;
}

// ProfilePicture component (unchanged)
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

// StatusBadge component (unchanged)
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

// StaffView component (aligned with StudentView)
const StaffView: React.FC<{
  staffs: StaffData[];
  searchQuery: string;
  staffLoading: boolean;
  isFetchingMore: boolean;
  onLoadMore: () => void;
}> = ({ staffs, searchQuery, staffLoading, isFetchingMore, onLoadMore }) => {
  const router = useRouter();
  const getDisplayedCount = () =>
    searchQuery.trim()
      ? `${staffs.length} result${staffs.length !== 1 ? "s" : ""} found`
      : `${staffs.length} staff${staffs.length !== 1 ? "s" : ""}`;

  if (staffLoading && !isFetchingMore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading staff...</Text>
      </View>
    );
  }

  return (
    <View style={styles.staffContainer}>
      {searchQuery.trim() && (
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsText}>{getDisplayedCount()}</Text>
        </View>
      )}

      {staffs.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name={searchQuery.trim() ? "magnify" : "account-group"}
            size={64}
            color="#9CA3AF"
          />
          <Text style={styles.emptyStateTitle}>
            {searchQuery.trim() ? "No matching staff found" : "No staff found"}
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchQuery.trim()
              ? `No staff match "${searchQuery}". Try a different search term.`
              : "Try adjusting your filters or check back later"}
          </Text>
        </View>
      ) : (
        <FlashList
          data={staffs}
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
              style={styles.staffCard}
              onPress={() => {
                router.push({
                  pathname: "/(principalScreen)/staffList/[id]",
                  params: { id: item.staffId, details: JSON.stringify(item) },
                });
              }}
            >
              <View style={styles.staffHeader}>
                <View style={styles.staffBasicInfo}>
                  <ProfilePicture
                    uri={item.photo}
                    name={item.fullName}
                    size={56}
                  />
                  <View style={styles.staffNameContainer}>
                    <Text style={styles.staffName}>{item.fullName}</Text>
                    <Text style={styles.staffEmail}>
                      {item.email || "No email"}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.staffDetails}>
                <View style={styles.detailRow}>
                  <Icon name="briefcase" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.department?.departmentName ||
                      "No department assigned"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="badge-account" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {item.roleOrPosition?.designationName || "No role assigned"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    Joined:{" "}
                    {new Date(
                      parseInt(item.joiningDate)
                    ).toLocaleDateString() || "N/A"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.staffId}
        />
      )}
    </View>
  );
};

// Main StaffList component
export default function StaffList() {
  const [filter, setFilter] = useState<Filter>({
    department: "All",
    status: "All",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const itemsPerPage = 10;

  const { departmentData, isDepartmentLoading } = useDepartmentData();
  const {
    staffs,
    totalCount,
    isFetchingMore,
    staffLoading,
    handleLoadMore,
    refetch,
  } = useStaffData(filter, debouncedSearchQuery, itemsPerPage);

  console.log("staffs", staffs);
  console.log("totalCount", totalCount);

  // Reset filters and refetch when needed
  const resetFilters = () => {
    setFilter({ department: "All", status: "All" });
    setSearchQuery("");
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filter, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value === "All" ? "All" : value, // Ensure "All" sets empty string
    }));
  };

  // Refetch when filters or search query are cleared
  useEffect(() => {
    refetch();
  }, [filter.department, filter.status, debouncedSearchQuery, refetch]);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.header}>
          <Text style={styles.headerSubtitle}>{totalCount} total staff</Text>
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
              placeholder="Search staff by name, id, email or phone"
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
            {/* Department Filter */}
            <View style={styles.filterPill}>
              <Text style={styles.filterLabel}>Department</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filter.department}
                  onValueChange={(value) =>
                    handleFilterChange("department", value)
                  }
                  style={styles.picker}
                  dropdownIconColor="#6366F1"
                  enabled={!isDepartmentLoading && departmentData?.length > 0}
                >
                  <Picker.Item label="All" value="All" />
                  {departmentData?.map((dept: DepartmentData) => (
                    <Picker.Item
                      key={dept.departmentId}
                      label={dept.name}
                      value={dept.departmentId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterPill}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={filter.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
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

          {/* Reset Filters Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}
            disabled={!filter.department && !filter.status && !searchQuery}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>

        <StaffView
          staffs={staffs}
          searchQuery={searchQuery}
          staffLoading={staffLoading}
          isFetchingMore={isFetchingMore}
          onLoadMore={handleLoadMore}
        />
      </View>
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
  resetButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    opacity: 0.9,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  filterWrapper: {
    flex: 1,
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
  staffContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  staffCard: {
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
  staffHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  staffBasicInfo: {
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
  staffNameContainer: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  staffEmail: {
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
  staffDetails: {
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
