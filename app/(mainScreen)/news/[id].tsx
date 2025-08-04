import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';

type RootStackParamList = {
  NewsId: {
    id: string;
    title: string;
    image: string;
    date: string;
    preview: string;
    content?: string;
    author?: string;
    department?: string;
  };
};

// This would typically come from an API
const newsData = {
  '1': {
    title: 'Annual Science Fair Coming Soon',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    date: 'March 15, 2024',
    content: `Get ready for the biggest science event of the year! The Annual Science Fair is approaching, and this year promises to be more exciting than ever.

Our students will showcase their innovative projects across various scientific disciplines, from environmental science to robotics. The event will feature:

• Interactive demonstrations
• Guest speakers from leading research institutions
• Hands-on workshops
• Awards ceremony for outstanding projects

The fair will be held in the main auditorium and will be open to parents, students, and the general public. This is a great opportunity for our young scientists to demonstrate their creativity and understanding of scientific principles.

Registration for participants is now open. Students interested in presenting their projects should submit their proposals by March 1st. Space is limited, so early registration is encouraged.

For more information about participation guidelines and schedule, please visit the school's science department office or contact your science teacher.`,
    author: 'Dr. Sarah Johnson',
    department: 'Science Department'
  },
  '2': {
    title: 'Sports Day Registration Open',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    date: 'March 12, 2024',
    content: `The much-awaited Annual Sports Day is just around the corner! We're excited to announce that registrations are now open for various sports competitions.

This year's event will feature:

• Track and field events
• Team sports tournaments
• Individual championships
• Special inter-house competitions

Students can participate in multiple events, but must ensure their schedules don't conflict. Training sessions will be organized in the weeks leading up to the event.

Key Dates:
- Registration Deadline: March 20
- Practice Sessions: March 21-25
- Main Event: March 26-27

Don't miss this opportunity to showcase your athletic abilities and represent your house!`,
    author: 'Coach Mike Peterson',
    department: 'Physical Education'
  },
  '3': {
    title: 'New Library Resources Available',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
    date: 'March 10, 2024',
    content: `The school library is proud to announce the addition of new digital resources to our collection! These resources are now available to all students and faculty members.

New Additions Include:

• Online research databases
• E-book collections
• Digital magazines and journals
• Educational video content
• Interactive learning tools

All resources can be accessed both on campus and remotely using your student credentials. Our library staff has organized orientation sessions to help you make the most of these new resources.

We've also upgraded our library management system to make searching and borrowing easier than ever. The new system includes features like:

- Advanced search capabilities
- Personal reading lists
- Resource recommendations
- Digital reservation system`,
    author: 'Ms. Linda Thompson',
    department: 'Library Services'
  }
};


export default function NewsDetail() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewsId'>>();
  const route = useRoute();
  const { id } = route.params as RootStackParamList['NewsId'];
  const news = newsData[id as keyof typeof newsData];

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>News article not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Detail</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Image source={{ uri: news.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.date}>{news.date}</Text>
          <Text style={styles.title}>{news.title}</Text>
          
          <View style={styles.authorInfo}>
            <Text style={styles.author}>By {news.author}</Text>
            <Text style={styles.department}>{news.department}</Text>
          </View>

          <Text style={styles.body}>{news.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#000',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorInfo: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  author: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  department: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 24,
  },
});