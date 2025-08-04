import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const Welcome = ({ userName }: { userName: string }) => {
  console.log(userName, "userName");
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Floating animations
    const createFloatAnimation = (animValue: any, duration: any) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -20,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnimation(floatAnim1, 3000).start();
    createFloatAnimation(floatAnim2, 4000).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating Decorative Elements */}
        <Animated.View
          style={[
            styles.gradientOrb1,
            {
              transform: [{ translateY: floatAnim1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientOrb2,
            {
              transform: [{ translateY: floatAnim2 }],
            },
          ]}
        />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
              <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <LinearGradient
                  colors={["#ffd89b", "#19547b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nameGradient}
                >
                  <Text style={styles.userName}>{userName}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.subtitle}>Ready to start your day?</Text>
            </BlurView>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  welcomeContainer: {
    width: "100%",
    maxWidth: 350,
  },
  blurContainer: {
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    overflow: "hidden",
  },
  greeting: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    fontWeight: "400",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  welcomeTextContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 8,
  },
  nameGradient: {
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  userName: {
    fontSize: 36,
    fontWeight: "700",
    color: "yellow",
    textAlign: "center",
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "300",
    textAlign: "center",
    lineHeight: 24,
  },
  gradientOrb1: {
    position: "absolute",
    top: height * 0.2,
    right: width * 0.15,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    opacity: 0.6,
  },
  gradientOrb2: {
    position: "absolute",
    bottom: height * 0.3,
    left: width * 0.1,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    opacity: 0.4,
  },
});

export default Welcome;
