import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Assignment from "@/components/parent/assignment/Assignment";

export default function AssignmentsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Assignment />
    </View>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
});
