import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const ComingSoonComponent = ({
  title = "Amazing Feature",
  description = "We're working hard to bring you something extraordinary. Stay tuned!",
  launchDate = "Spring 2025",
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the main circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleNotifyMe = () => {
    Alert.alert(
      "Notify Me! 🔔",
      "We'll let you know when this feature is ready!",
      [{ text: "Awesome!", style: "default" }]
    );
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#1e3c72", "#2a5298", "#6dd5ed"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 "
      >
        {/* Background decorative elements */}
        <Animated.View
          className="absolute top-20 right-8 w-24 h-24 rounded-full bg-white/10"
          style={{
            transform: [{ translateY: floatAnim }, { rotate: spin }],
          }}
        />
        <Animated.View
          className="absolute bottom-32 left-6 w-16 h-16 rounded-full bg-white/5"
          style={{
            transform: [{ translateY: floatAnim }],
          }}
        />
        <Animated.View
          className="absolute top-1/3 left-4 w-8 h-8 rounded-full bg-white/15"
          style={{
            transform: [{ rotate: spin }],
          }}
        />

        <Animated.View
          className="flex-1 justify-center items-center px-8"
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          {/* Main content card */}
          <BlurView
            intensity={25}
            tint="light"
            className="rounded-3xl p-8 w-full max-w-sm border border-white/20"
          >
            {/* Central animated element */}
            <View className="items-center mb-8">
              <Animated.View
                className="w-32 h-32 rounded-full items-center justify-center mb-6"
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <LinearGradient
                  colors={["#ff9a9e", "#fecfef", "#fecfef"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full h-full rounded-full items-center justify-center"
                >
                  <View className="w-20 h-20 rounded-full bg-white/30 items-center justify-center">
                    <Text className="text-4xl">🚀</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            </View>

            {/* Text content */}
            <View className="items-center space-y-4">
              <Text className="text-2xl font-bold text-white text-center leading-7">
                {title}
              </Text>

              <Text className="text-base text-white/80 text-center leading-6 px-2">
                {description}
              </Text>

              <View className="bg-white/10 rounded-xl px-4 py-2 mt-4">
                <Text className="text-sm font-semibold text-white/90 text-center">
                  Expected Launch: {launchDate}
                </Text>
              </View>
            </View>

            {/* Action button */}
            <Pressable
              onPress={handleNotifyMe}
              className="mt-8 bg-white/20 rounded-xl p-4 border border-white/30 active:bg-white/30"
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Text className="text-white font-semibold text-center text-base">
                Notify Me When Ready! 🔔
              </Text>
            </Pressable>
          </BlurView>

          {/* Bottom decorative text */}
          <Animated.View
            className="mt-8"
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              }),
            }}
          >
            <Text className="text-white/60 text-2xl text-center font-medium tracking-widest uppercase">
              Coming Soon
            </Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ComingSoonComponent;
