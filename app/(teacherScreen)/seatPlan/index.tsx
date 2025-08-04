import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ACADEMIC_YEARS } from "@/components/calendar/calendar-graphql";
import SeatPlan from "@/components/teacher/seatPlan/SeatPlan";

const SeatPlanScreen = () => {
  return <SeatPlan />;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
export default SeatPlanScreen;
