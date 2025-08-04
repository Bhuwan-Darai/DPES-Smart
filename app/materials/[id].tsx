import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { ChevronLeft, FileText, Link as LinkIcon, Download } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_MATERIAL_DETAILS } from '@/lib/hooks/graphql/queries';

interface Attachment {
  id: string;
  name: string;
  url: string;
}

interface MaterialDetails {
  id: string;
  title: string;
  type: string;
  description: string;
  url: string;
  courseId: string;
  createdAt: string;
  content: string;
  attachments: Attachment[];
}

interface MaterialDetailsData {
  material: MaterialDetails;
}

export default function MaterialDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loading, error, data } = useQuery<MaterialDetailsData>(GET_MATERIAL_DETAILS, {
    variables: { id },
  });

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
        <Text style={styles.errorText}>Error loading material: {error.message}</Text>
      </View>
    );
  }

  const material = data?.material;

  const handleAttachmentPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Material Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.materialHeader}>
          <Text style={styles.materialTitle}>{material?.title}</Text>
          <Text style={styles.materialType}>{material?.type}</Text>
          <Text style={styles.materialDate}>
            Added on {new Date(material?.createdAt || '').toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{material?.description}</Text>
        </View>

        {material?.content && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.content}>{material.content}</Text>
          </View>
        )}

        {material?.url && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(material.url)}
          >
            <LinkIcon size={20} color="#007AFF" />
            <Text style={styles.linkText}>Open External Link</Text>
          </TouchableOpacity>
        )}

        {material?.attachments && material.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            {material.attachments.map((attachment) => (
              <TouchableOpacity
                key={attachment.id}
                style={styles.attachmentButton}
                onPress={() => handleAttachmentPress(attachment.url)}
              >
                <FileText size={20} color="#007AFF" />
                <Text style={styles.attachmentText}>{attachment.name}</Text>
                <Download size={20} color="#007AFF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  materialHeader: {
    marginBottom: 24,
  },
  materialTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  materialType: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#007AFF',
    marginBottom: 4,
  },
  materialDate: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000',
    lineHeight: 24,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#007AFF',
    marginLeft: 12,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#007AFF',
    marginLeft: 12,
  },
}); 