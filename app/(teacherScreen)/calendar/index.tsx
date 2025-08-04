import { GET_CALENDAR_EVENTS } from "@/components/calendar/calendar-graphql";
import CalendarView from "@/components/calendar/CalendarView";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { View, Text } from "react-native";

const CalendarScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <CalendarView />
    </View>
  );
};

export default CalendarScreen;
