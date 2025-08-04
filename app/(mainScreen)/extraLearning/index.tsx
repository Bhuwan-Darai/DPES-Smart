import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TopBar from "@/components/TopBar";

type RootStackParamList = {
  ExtraLearningId: {
    id: string;
    title: string;
    image: string;
    duration: string;
    instructor: string;
    description: string;
    category: string;
    level: string;
  };
};

const extraLearningData = {
  "1": {
    title: "Advanced Mathematics",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
    duration: "2 hours",
    instructor: "Dr. Robert Smith",
    description:
      "Advanced mathematics course covering calculus, linear algebra, and more.",
    category: "Mathematics",
    level: "Advanced",
  },
  "2": {
    title: "Creative Writing Workshop",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    duration: "1.5 hours",
    instructor: "Prof. Emily Johnson",
    description:
      "Enhance your creative writing skills through interactive workshops.",
    category: "Literature",
    level: "Intermediate",
  },
  "3": {
    title: "Physics Lab Experiments",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    duration: "3 hours",
    instructor: "Dr. Michael Chen",
    description:
      "Hands-on physics experiments covering mechanics, electricity, and more.",
    category: "Physics",
    level: "Intermediate",
  },
};

export default function ExtraLearningScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ExtraLearningId">
    >();

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Extra Learning</Text>
        {Object.entries(extraLearningData).map(([id, item]) => (
          <TouchableOpacity
            key={id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("ExtraLearningId", {
                id,
                ...item,
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardInstructor}>By {item.instructor}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoText}>{item.duration}</Text>
                <Text style={styles.cardInfoText}>•</Text>
                <Text style={styles.cardInfoText}>{item.level}</Text>
              </View>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontFamily: "Inter_900Black",
    fontSize: 24,
    color: "#000",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 4,
  },
  cardInstructor: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardInfoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
