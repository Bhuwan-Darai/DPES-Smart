import React, { useState, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const handleError = (error: Error, errorInfo: any) => {
    console.error("ErrorBoundary caught:", error, errorInfo);
    setErrorState({ hasError: true, error });
  };

  if (errorState.hasError) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          An error occurred. Please try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setErrorState({ hasError: false, error: null })}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ErrorBoundaryWrapper onError={handleError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

const ErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  onError: (error: Error, errorInfo: any) => void;
}> = ({ children, onError }) => {
  try {
    return <>{children}</>;
  } catch (error: any) {
    onError(error, {});
    return null;
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F8FAFC",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ErrorBoundary;