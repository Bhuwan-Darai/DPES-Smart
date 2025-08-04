import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Bell } from 'lucide-react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'academic' | 'event' | 'reminder';
  isRead: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Quiz Reminder',
    message: 'Physics quiz starts in 30 minutes. Be prepared!',
    time: '10 min ago',
    type: 'academic',
    isRead: false,
  },
  {
    id: '2',
    title: 'Annual Sports Day',
    message: 'Registration for annual sports day is now open. Register before March 20th.',
    time: '2 hours ago',
    type: 'event',
    isRead: false,
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting',
    message: "Schedule for next week's parent-teacher meeting has been updated.",
    time: '5 hours ago',
    type: 'reminder',
    isRead: true,
  },
  {
    id: '4',
    title: 'Assignment Due',
    message: "Mathematics assignment due tomorrow. Don't forget to submit!",
    time: '1 day ago',
    type: 'academic',
    isRead: true,
  },
];

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Bell size={20} color="#007AFF" />
              <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.unreadNotification,
                ]}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    maxWidth: 420,
    height: '100%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  notificationTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 12,
  },
});