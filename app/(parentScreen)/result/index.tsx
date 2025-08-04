import { View } from "react-native";
import React from "react";
import ResultLedgerParent from "@/components/parent/Result/ResultLedgerParent";

export default function ResultScreenParent() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <ResultLedgerParent />
    </View>
  );
}
