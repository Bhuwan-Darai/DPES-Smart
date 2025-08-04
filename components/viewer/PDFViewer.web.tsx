import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export interface PDFViewerProps {
  source: {
    uri: string;
    cache?: boolean;
  };
}

const PDFViewer: React.FC<PDFViewerProps> = ({ source }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF");
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading PDF...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading PDF: {error}</Text>
        </View>
      )}
      
      <iframe
        src={source.uri}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: isLoading || error ? 'none' : 'block'
        }}
        onLoad={handleLoad}
        onError={handleError}
        title="PDF Viewer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
    zIndex: 1
  },
  errorText: {
    color: 'red',
    fontSize: 16
  }
});

export default PDFViewer;