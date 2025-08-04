import ExamRoutine from "@/components/parent/ExamRoutine/ExamRoutine";
import { View, StyleSheet } from "react-native";

export default function ExamRoutineScreen() {
  return (
    <View style={styles.container}>
      <ExamRoutine />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
