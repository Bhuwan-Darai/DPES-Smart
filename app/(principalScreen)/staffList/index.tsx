import StaffList from "@/components/principal/staff/StaffList";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export default function StaffListScreen() {
  return (
    <View style={styles.container}>
      <StaffList />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});