import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import for gradient
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const splashData = [
  {
    title: "Welcome to Student App",
    description: "Your one-stop solution for managing your academic journey",
    image: require("../assets/images/school1.jpg"),
  },
  {
    title: "Track Your Progress",
    description:
      "Monitor your attendance, grades, and assignments in real-time",
    image: require("../assets/images/school2.jpg"),
  },
  {
    title: "Stay Connected",
    description: "Connect with teachers and classmates seamlessly",
    image: require("../assets/images/school5.jpg"),
  },
];

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < splashData.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/auth/login");
    }
  };

  const handleSkip = () => {
    router.replace("/auth/login");
  };

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <LinearGradient
      colors={["#e0f2fe", "#f8fafc"]} // Soft gradient for background
      style={styles.container}
    >
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {splashData.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Animated.Image
              source={item.image}
              style={[
                styles.image,
                {
                  transform: [
                    {
                      scale: scrollX.interpolate({
                        inputRange: [
                          (index - 1) * width,
                          index * width,
                          (index + 1) * width,
                        ],
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {splashData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8], // Slightly larger active dot
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <LinearGradient
          colors={["#007AFF", "#3b82f6"]} // Gradient for next button
          style={styles.nextButton}
        >
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex === splashData.length - 1 ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Subtle off-white background for a softer look
  },
  slide: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent", // Ensure slide background doesn't interfere with gradient
  },
  image: {
    width: width * 0.85, // Slightly larger image for better visual impact
    height: height * 0.45,
    resizeMode: "cover", // Changed to 'cover' for better image scaling
    marginBottom: 40,
    borderRadius: 15, // Rounded corners for a modern touch
    shadowColor: "#000", // Add subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 32, // Larger font for emphasis
    fontWeight: "700", // Bolder weight for modern typography
    color: "#1e293b", // Darker, more professional color
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System", // Use system font for consistency, replace with custom font if available
    letterSpacing: 0.5, // Subtle letter spacing for readability
  },
  description: {
    fontSize: 18, // Slightly larger for better readability
    color: "#475569", // Softer gray for secondary text
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 26, // Improved line height for better text flow
    fontFamily: "System", // Consistent font usage
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 120, // Adjusted position to align better with buttons
    alignSelf: "center",
  },
  dot: {
    width: 12, // Slightly larger dots for visibility
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF", // Keep brand color
    marginHorizontal: 6,
    shadowColor: "#000", // Subtle shadow for dots
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40, // Slightly higher for better spacing
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  skipButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background for skip button
  },
  skipText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
  },
  nextButton: {
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 30, // More rounded for a modern look
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
    textAlign: "center",
  },
});
