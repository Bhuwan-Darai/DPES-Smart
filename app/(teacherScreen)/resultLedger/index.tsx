import { View, Text } from "react-native";
import React from "react";
import ResultLedger from "@/components/teacher/result/ResultLedger";

export default function ResultLedgerScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <ResultLedger />
    </View>
  );
}
