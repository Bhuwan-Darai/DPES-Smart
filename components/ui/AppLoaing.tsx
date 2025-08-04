import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showScreen, setShowScreen] = useState(true);
  const spinValue = new Animated.Value(0);

  // Spinner animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 100));
      } else {
        setTimeout(() => setShowScreen(false), 500);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [progress]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!showScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadedText}>Content Loaded!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>A</Text>
      </View>

      {/* Loading Spinner */}
      <View style={styles.spinnerContainer}>
        <View style={styles.spinnerBackground}></View>
        <Animated.View
          style={[styles.spinnerForeground, { transform: [{ rotate }] }]}
        ></Animated.View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.loadingText}>Loading your content...</Text>
      <Text style={styles.percentText}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 96,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  spinnerContainer: {
    position: "relative",
    marginBottom: 24,
  },
  spinnerBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#BFDBFE",
  },
  spinnerForeground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#3B82F6",
    borderTopColor: "transparent",
  },
  progressBar: {
    width: 256,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  loadingText: {
    color: "#4B5563",
    marginBottom: 4,
  },
  percentText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  loadedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
});
