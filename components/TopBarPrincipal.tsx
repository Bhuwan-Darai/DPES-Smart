import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { Bell, GraduationCap } from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import NotificationModal from "./ui/NotificationModal";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "./ui/Loading";
import ErrorScreen from "./ui/ErrorScreen";
import { GET_PRINCIPAL_PROFILE } from "@/lib/hooks/graphql/PrincipalQueries";
import { SkeletonLoader } from "./TopBarParents";

export default function TopBarPrincipal() {
  const { userDetails } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const {
    data,
    loading,
    error,
    refetch: refetchPrincipal,
  } = useQuery(GET_PRINCIPAL_PROFILE, {
    variables: {
      id: userDetails?.id,
    },
    fetchPolicy: "cache-and-network",
    skip: !userDetails?.id,
  });

  console.log("principal data", JSON.stringify(data, null, 2));
  console.log("principal error", JSON.stringify(error, null, 2));

  if (error) {
    return <ErrorScreen onRetry={refetchPrincipal} />;
  }

  // Add null check for data and getStudentPersonalDetails
  const principalDetails = data?.getPrincipalProfileDetails?.data;

  // Loading UI that matches the same style
  if (loading || !principalDetails) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.profileSection}>
          <SkeletonLoader width={42} height={42} borderRadius={21} />
          <View style={[styles.textInfo, { marginLeft: 12 }]}>
            <SkeletonLoader width={120} height={16} borderRadius={8} />
            <View style={{ marginTop: 6 }}>
              <SkeletonLoader width={160} height={13} borderRadius={6} />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={styles.iconButton}>
            <SkeletonLoader width={22} height={22} borderRadius={4} />
          </View>
          <View style={styles.iconButton}>
            <SkeletonLoader width={22} height={22} borderRadius={4} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
          }}
          style={styles.profileImage}
        />
        <View style={styles.textInfo}>
          <Text style={styles.name}>{principalDetails.fullName}</Text>
          <Text style={styles.details}>Email: {principalDetails.email}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowNotifications(true)}
        >
          <Bell size={22} color="#333" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/(mainScreen)/extraLearning")}
        >
          <GraduationCap size={22} color="#333" />
        </TouchableOpacity> */}
      </View>
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 10,

    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: StatusBar.currentHeight || 44,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  textInfo: {
    justifyContent: "center",
  },
  name: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  details: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
