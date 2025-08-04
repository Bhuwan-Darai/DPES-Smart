import { View, Text } from "react-native";
import React from "react";
import TakeTeacherAttendance from "@/components/teacher/attendance/TakeTeacherAttendance";

export default function MakeAttendanceScreen() {
  return (
    <View className="flex-1 bg-white">
      <TakeTeacherAttendance />
    </View>
  );
}
