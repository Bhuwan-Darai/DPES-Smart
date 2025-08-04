import React, { useState } from "react";
import { useWindowDimensions, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import Pdf from "react-native-pdf";

export interface PDFViewerProps {
  source: {
    uri: string;
    cache?: boolean;
  };
}

const PDFViewer: React.FC<PDFViewerProps> = ({ source }) => {
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      <Pdf 
        source={source}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
          setIsLoading(false);
          setError(error.toString());
        }}
        trustAllCerts={false}
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
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%'
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