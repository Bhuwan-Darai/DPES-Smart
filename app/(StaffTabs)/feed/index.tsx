"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import TopBar from "@/components/TopBar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react-native";
import { GET_ALL_STUDENTS_WITH_DIVISION } from "@/lib/hooks/graphql/queries";
import { useQuery } from "@apollo/client";

type PostType = "text" | "image" | "link" | "mcq";

interface Post {
  id: string;
  type: PostType;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  link?: {
    url: string;
    title: string;
    description: string;
  };
  mcq?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  likes: number;
  comments: number;
  timestamp: string;
}

export default function FeedScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState<{
    [key: string]: number | null;
  }>({});
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});

  const posts: Post[] = [
    {
      id: "1",
      type: "text",
      author: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        role: "Mathematics Teacher",
      },
      content:
        "Just finished preparing an exciting new lesson on calculus! Students will learn about derivatives and their applications in real-world scenarios. Stay tuned for some mind-bending problems! 🧮✨",
      likes: 124,
      comments: 23,
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "image",
      author: {
        name: "Science Club",
        avatar:
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
        role: "School Club",
      },
      content:
        "Check out our latest science experiment! We created a mini volcano using baking soda and vinegar. The students had a blast! 🌋",
      image:
        "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800",
      likes: 256,
      comments: 45,
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      type: "link",
      author: {
        name: "Library Department",
        avatar:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
        role: "School Library",
      },
      content: "New educational resources available!",
      link: {
        url: "https://example.com/resources",
        title: "Free Educational Resources",
        description:
          "Access our collection of free educational materials, including e-books, videos, and interactive quizzes.",
      },
      likes: 89,
      comments: 12,
      timestamp: "6 hours ago",
    },
    {
      id: "4",
      type: "mcq",
      author: {
        name: "Physics Department",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        role: "Physics Teacher",
      },
      content: "Test your knowledge with this quick physics quiz!",
      mcq: {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Ampere", "Watt", "Ohm"],
        correctAnswer: 1,
      },
      likes: 167,
      comments: 34,
      timestamp: "8 hours ago",
    },
  ];

  const handleAnswerSelect = (postId: string, optionIndex: number) => {
    setSelectedAnswer((prev) => ({ ...prev, [postId]: optionIndex }));
    setShowAnswer((prev) => ({ ...prev, [postId]: true }));
  };

  const renderPost = (post: Post) => {
    return (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.authorRole}>{post.author.role}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreHorizontal size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.postContent}>{post.content}</Text>

        {post.type === "image" && post.image && (
          <Image source={{ uri: post.image }} style={styles.postImage} />
        )}

        {post.type === "link" && post.link && (
          <TouchableOpacity style={styles.linkCard}>
            <LinkIcon size={20} color="#007AFF" />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>{post.link.title}</Text>
              <Text style={styles.linkDescription}>
                {post.link.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {post.type === "mcq" && post.mcq && (
          <View style={styles.mcqContainer}>
            <Text style={styles.mcqQuestion}>{post.mcq.question}</Text>
            {post.mcq.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.mcqOption,
                  selectedAnswer[post.id] === index && styles.selectedOption,
                  showAnswer[post.id] &&
                    index === post.mcq?.correctAnswer &&
                    styles.correctOption,
                ]}
                onPress={() => handleAnswerSelect(post.id, index)}
                disabled={showAnswer[post.id]}
              >
                <Text
                  style={[
                    styles.mcqOptionText,
                    selectedAnswer[post.id] === index &&
                      styles.selectedOptionText,
                    showAnswer[post.id] &&
                      index === post.mcq?.correctAnswer &&
                      styles.correctOptionText,
                  ]}
                >
                  {option}
                </Text>
                {showAnswer[post.id] &&
                  (index === post.mcq?.correctAnswer ? (
                    <CheckCircle size={20} color="#34C759" />
                  ) : selectedAnswer[post.id] === index ? (
                    <XCircle size={20} color="#FF3B30" />
                  ) : null)}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.postFooter}>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color="#666" />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color="#666" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <View style={styles.createPost}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
            }}
            style={styles.userAvatar}
          />
          <TouchableOpacity style={styles.postInput}>
            <Text style={styles.postInputText}>What's on your mind?</Text>
          </TouchableOpacity>
        </View>
        {posts.map(renderPost)}
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
  createPost: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    padding: 12,
  },
  postInputText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#000",
  },
  authorRole: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkCard: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  linkContent: {
    flex: 1,
    marginLeft: 12,
  },
  linkTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  linkDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  mcqContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  mcqQuestion: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#000",
    marginBottom: 12,
  },
  mcqOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#E5E5EA",
  },
  correctOption: {
    backgroundColor: "#E8F5E9",
  },
  mcqOptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  selectedOptionText: {
    color: "#666",
  },
  correctOptionText: {
    color: "#34C759",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  postActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
});
