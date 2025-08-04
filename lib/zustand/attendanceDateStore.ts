import { create } from "zustand";

export type AttendanceDateState = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
};

export const useAttendanceDateStore = create<AttendanceDateState>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export const useTeacherAttendanceDateStore = create<AttendanceDateState>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

