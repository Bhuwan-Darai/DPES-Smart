import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import React from 'react';

// This would typically come from an API
const studyMaterials = {
  'derivatives': {
    type: 'video',
    title: 'Introduction to Derivatives',
    url: 'https://www.youtube.com/embed/rAof9Ld5sOg'
  },
  'integration': {
    type: 'video',
    title: 'Integration Basics',
    url: 'https://www.youtube.com/embed/rfG8ce4nNh0'
  },
  'practice-problems': {
    type: 'pdf',
    title: 'Practice Problems Set 1',
    url: 'https://www.africau.edu/images/default/sample.pdf'
  },
  'linear-equations': {
    type: 'video',
    title: 'Linear Equations',
    url: 'https://www.youtube.com/embed/MkeWipU6jY8'
  }
};

export default function MaterialViewer() {
  const { id } = useLocalSearchParams();
  const material = studyMaterials[id as keyof typeof studyMaterials];

  if (!material) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Material not found</Text>
      </View>
    );
  }

  const getContentComponent = () => {
    switch (material.type) {
      case 'video':
        return (
          <WebView
            style={styles.webview}
            source={{ uri: material.url }}
            allowsFullscreenVideo
            javaScriptEnabled
          />
        );
      case 'pdf':
        return (
          <WebView
            style={styles.webview}
            source={{ uri: material.url }}
          />
        );
      default:
        return (
          <Text style={styles.errorText}>Unsupported content type</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{material.title}</Text>
      </View>
      {getContentComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 18,
    color: '#000',
  },
  webview: {
    flex: 1,
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 24,
  },
});