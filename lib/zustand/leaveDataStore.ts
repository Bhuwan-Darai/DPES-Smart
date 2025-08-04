import { create } from "zustand";
interface LeaveNote {
  leaveNotesId: string;
  studentId: string;
  reason: string;
  status: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
  emergencyContact: string;
  createdAt: string;
  updatedAt: string;
}
export type LeaveDataState = {
  showAddForm: boolean;
  setShowAddForm: (showAddForm: boolean) => void;
  editLeaveNote: LeaveNote | null;
  setEditLeaveNote: (editLeaveNote: LeaveNote | null) => void;
};

export const useLeaveDataStore = create<LeaveDataState>((set) => ({
  showAddForm: false,
  setShowAddForm: (showAddForm) => set({ showAddForm }),
  editLeaveNote: null,
  setEditLeaveNote: (editLeaveNote) => set({ editLeaveNote }),
}));
