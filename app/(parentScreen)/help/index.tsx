import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const faqs = [
  {
    question: "How do I access my study materials?",
    answer:
      "You can access your study materials by going to the Study tab and selecting your subject. All materials are organized by chapters and include videos, PDFs, and quizzes.",
  },
  {
    question: "How do I submit assignments?",
    answer:
      "To submit assignments, go to the Assignments tab, select the assignment you want to submit, and follow the submission instructions. You can upload files or submit text directly.",
  },
  {
    question: "How do I track my progress?",
    answer:
      "Your progress is automatically tracked in the Performance tab. You can view your grades, attendance, and overall academic performance there.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Settings > Account > Change Password. Follow the prompts to update your password securely.",
  },
  {
    question: "How do I contact my teachers?",
    answer:
      "You can contact your teachers through the messaging feature in the app. Go to the Messages tab to start a conversation.",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View> */}

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFaqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronUp size={20} color="#8E8E93" />
                ) : (
                  <ChevronDown size={20} color="#8E8E93" />
                )}
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactOption}>
              <MessageCircle size={24} color="#007AFF" />
              <Text style={styles.contactOptionText}>Live Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption}>
              <Mail size={24} color="#007AFF" />
              <Text style={styles.contactOptionText}>Email Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactOption}>
              <Phone size={24} color="#007AFF" />
              <Text style={styles.contactOptionText}>Call Support</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={styles.section}>
          <View style={styles.appInfo}>
            <HelpCircle size={24} color="#007AFF" />
            <Text style={styles.appInfoText}>App Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    // marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#000",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: "#000",
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginTop: 12,
    lineHeight: 20,
  },
  contactOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  contactOption: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactOptionText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#000",
    marginTop: 8,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  appInfoText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#8E8E93",
    marginLeft: 8,
  },
});
