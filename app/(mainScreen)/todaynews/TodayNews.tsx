import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'School Annual Day Celebration',
    description: 'Join us for the grand celebration of our Annual Day on December 15th. Various cultural performances and prize distribution ceremony will be held.',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: 'Science Exhibition',
    description: 'Students from grades 8-12 will showcase their innovative science projects. Parents are invited to attend.',
    date: '2024-03-16'
  },
  {
    id: '3',
    title: 'Sports Meet Update',
    description: 'Inter-house sports competition schedule has been updated. Check the new timings for various events.',
    date: '2024-03-17'
  }
];

const NewsCard = ({ item }: { item: NewsItem }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.newsCard}>
      <TouchableOpacity 
        style={styles.newsHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.newsTitle}>{item.title}</Text>
        {expanded ? (
          <ChevronUp size={20} color="#007AFF" />
        ) : (
          <ChevronDown size={20} color="#007AFF" />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.newsContent}>
          <Text style={styles.newsDate}>{item.date}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
        </View>
      )}
    </View>
  );
};

export default function TodayNews() {
  return (
    <ScrollView style={styles.container}>
      {sampleNews.map((news) => (
        <NewsCard key={news.id} item={news} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  newsContent: {
    marginTop: 12,
  },
  newsDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
}); 