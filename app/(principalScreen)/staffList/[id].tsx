import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

const StaffDetails: React.FC = () => {
  const { id, details } = useLocalSearchParams();
  console.log("id", id);
  console.log("details", JSON.parse(details as string));
  
  const detailsData = JSON.parse(details as string);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1/1/1970") return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#4CAF50" : "#F44336";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {detailsData.photo ? (
            <Image source={{ uri: detailsData.photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                {detailsData.fullName?.charAt(0) || "?"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{detailsData.fullName || "N/A"}</Text>
          <Text style={styles.customId}>{detailsData.customId || "N/A"}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(detailsData.status) }]}>
              <Text style={styles.statusText}>{detailsData.status?.toUpperCase() || "UNKNOWN"}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{detailsData.email || "Not provided"}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{detailsData.phone || "Not provided"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Position:</Text>
            <Text style={styles.value}>
              {detailsData.roleOrPosition?.designationName || "Not specified"}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>
              {detailsData.department?.departmentName || "Not specified"}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Joining Date:</Text>
            <Text style={styles.value}>{formatDate(detailsData.joiningDate)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Experience:</Text>
            <Text style={styles.value}>
              {detailsData.yearOfExperience || "Not specified"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoContainer: {
    marginRight: 20,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#757575",
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  customId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  staffId: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
});

export default StaffDetails;