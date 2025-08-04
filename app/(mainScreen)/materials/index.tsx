import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_MATERIALS } from '@/lib/hooks/graphql/queries';

interface Material {
  id: string;
  title: string;
  type: string;
  description: string;
  url: string;
  courseId: string;
  createdAt: string;
}

interface MaterialsData {
  materials: Material[];
}

export default function MaterialsScreen() {
  const router = useRouter();
  const { loading, error, data } = useQuery<MaterialsData>(GET_MATERIALS);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading materials: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Materials</Text>
      </View> */}

      <ScrollView style={styles.content}>
        {data?.materials.map((material: Material) => (
          <TouchableOpacity
            key={material.id}
            style={styles.materialCard}
            onPress={() => router.push(`/materials/${material.id}` as any)}
          >
            <Text style={styles.materialTitle}>{material.title}</Text>
            <Text style={styles.materialType}>{material.type}</Text>
            <Text style={styles.materialDescription} numberOfLines={2}>
              {material.description}
            </Text>
            <Text style={styles.materialDate}>
              Added on {new Date(material.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  materialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materialTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  materialType: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#007AFF',
    marginBottom: 8,
  },
  materialDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  materialDate: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
}); 