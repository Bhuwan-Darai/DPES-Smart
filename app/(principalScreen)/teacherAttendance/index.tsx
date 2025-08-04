import TeacherAttendance from "@/components/principal/teacherAttendance/TeacherAttendance";
import { View, Text, StyleSheet } from "react-native";

export default function TeacherAttendanceScreen() {
  return (
    <View style={styles.container}>
      <TeacherAttendance/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})