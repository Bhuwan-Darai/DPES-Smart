import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Mail, Phone, MapPin, Book, Calendar } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitials}>JD</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Student</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Mail size={20} color="#007AFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>john.doe@school.com</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Phone size={20} color="#007AFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+1 234 567 8900</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={20} color="#007AFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>123 School Street, City</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Book size={20} color="#007AFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Class</Text>
              <Text style={styles.infoValue}>Class XII-A</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Calendar size={20} color="#007AFF" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Roll Number</Text>
              <Text style={styles.infoValue}>2023001</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 