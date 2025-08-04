import ChildHomeWork from "@/components/parent/HomeWork/ChildHomeWork";
import HomeWork from "@/components/parent/HomeWork/ChildHomeWork";
import { View, Text, StyleSheet } from "react-native";

export default function HomeworkScreen() {
  return (
    <View style={styles.container}>
      <ChildHomeWork />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
