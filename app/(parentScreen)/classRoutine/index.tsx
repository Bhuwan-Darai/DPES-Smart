import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import ClassRoutine from "@/components/parent/ClassRoutine/ClassRoutine";

export default function ClassRoutineScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ClassRoutine />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
