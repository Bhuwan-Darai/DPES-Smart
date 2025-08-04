// LeaveNoteManager.tsx

import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLeaveDataStore } from "@/lib/zustand/leaveDataStore";
import StudentLeaveForm from "./StudentLeaveForm";
import LeaveNotesList from "./StudentLeaveList";
// Optional: Extract list into separate component

export default function LeaveNoteManager() {
  const { showAddForm, setShowAddForm } = useLeaveDataStore();

  return (
    <View style={styles.container}>
      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoiding}
          >
            <ScrollView contentContainerStyle={styles.modalContent}>
              <StudentLeaveForm />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <LeaveNotesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  keyboardAvoiding: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 0,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    elevation: 10,
    minHeight: "60%",
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-start",
  },
});
