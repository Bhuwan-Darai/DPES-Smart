const getLeaveTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "sick":
      return "#EF4444";
    case "vacation":
      return "#3B82F6";
    case "personal":
      return "#8B5CF6";
    case "emergency":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

import {
  DELETE_LEAVE_NOTE,
  GET_LEAVE_NOTES_BY_PARENT,
} from "@/lib/hooks/graphql/ParentQueries";
import { useMutation, useQuery } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import moment from "moment";
import { useLeaveDataStore } from "@/lib/zustand/leaveDataStore";

const { width } = Dimensions.get("window");

interface LeaveNote {
  leaveNotesId: string;
  studentId: string;
  reason: string;
  status: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
}

const LeaveNotesList = () => {
  const { setShowAddForm, setEditLeaveNote } = useLeaveDataStore();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // queries to fetch leave notes
  const { data, loading, error, refetch } = useQuery(
    GET_LEAVE_NOTES_BY_PARENT,
    {
      variables: {
        page: currentPage,
        limit: pageSize,
      },
    }
  );

  console.log(JSON.stringify(data, null, 2), "leave notes data");
  console.log(JSON.stringify(error, null, 2), "leave notes error");

  // mutation to delete leave note
  const [deleteLeaveNote] = useMutation(DELETE_LEAVE_NOTE);

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading leave notes...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to load leave notes</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#D1FAE5";
      case "pending":
        return "#FEF3C7";
      case "rejected":
        return "#FEE2E2";
      default:
        return "#F3F4F6";
    }
  };

  const handleEdit = (item: LeaveNote) => {
    // TODO: Navigate to edit screen or open edit modal
    // console.log("Edit leave note:", item.leaveNotesId);
    setEditLeaveNote(item);
    // console.log("Edit leave note:", item.leaveNotesId);

    setShowAddForm(true);
    console.log("Edit leave item:", item);
  };

  const handleDelete = (item: LeaveNote) => {
    Alert.alert(
      "Delete Leave Request",
      "Are you sure you want to delete this leave request? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // TODO: Call delete mutation
            console.log("Delete leave note:", item.leaveNotesId);
            await deleteLeaveNote({
              variables: { leaveNotesId: item.leaveNotesId },
              onCompleted: () => {
                Alert.alert("Leave request deleted successfully");
                refetch();
              },
              onError: (error) => {
                console.log("Delete leave note error:", error);
                Alert.alert("Failed to delete leave request");
              },
            });
            console.log("Delete leave note:", item.leaveNotesId);
          },
        },
      ]
    );
  };

  const canEditOrDelete = (status: string) => {
    // Only allow edit/delete for pending requests
    return status.toLowerCase() === "pending";
  };

  const renderItem = ({ item }: { item: LeaveNote }) => {
    const formatDate = (dateString: string) =>
      moment(dateString).format("MMM DD, YYYY");

    const formatDateTime = (dateString: string) =>
      moment(dateString).format("MMM DD, YYYY • h:mm A");

    const getDuration = () => {
      const from = moment(item.fromDate);
      const to = moment(item.toDate);
      const duration = to.diff(from, "days") + 1;
      return duration === 1 ? "1 day" : `${duration} days`;
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackgroundColor(item.status) },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.createdDate}>{formatDate(item.createdAt)}</Text>
            {canEditOrDelete(item.status) && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.dateRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>From</Text>
              <Text style={styles.dateValue}>{formatDate(item.fromDate)}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>{getDuration()}</Text>
            </View>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>To</Text>
              <Text style={styles.dateValue}>{formatDate(item.toDate)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${getLeaveTypeColor(item.leaveType)}15` },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: getLeaveTypeColor(item.leaveType) },
                  ]}
                >
                  {item.leaveType}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>{item.emergencyContact}</Text>
            </View>
          </View>
        </View>

        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            Last updated: {formatDateTime(item.updatedAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No Leave Notes</Text>
      <Text style={styles.emptyStateSubtitle}>
        You haven't submitted any leave requests yet.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={data?.leaveNoteByParent?.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.leaveNotesId}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {data?.leaveNoteByParent?.total || 0} leave request
              {(data?.leaveNoteByParent?.total || 0) !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "600",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  createdDate: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  reasonContainer: {
    marginBottom: 20,
  },
  reasonText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
    lineHeight: 24,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  dateColumn: {
    flex: 1,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  durationContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  durationText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "700",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  timestampContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  timestampText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  footerContainer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default LeaveNotesList;
