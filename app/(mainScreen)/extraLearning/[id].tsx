import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronDown, ChevronRight, PlayCircle, FileText, Download, Check } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

type Subchapter = {
  id: string;
  title: string;
  type: 'video' | 'pdf';
  duration: string;
  content: string;
};

type Chapter = {
  id: string;
  title: string;
  subchapters: Subchapter[];
};

type ExtraLearningItem = {
  title: string;
  image: string;
  duration: string;
  instructor: string;
  description: string;
  category: string;
  level: string;
  chapters: Chapter[];
};

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

// Sample data - replace with your API call
const extraLearningData: Record<string, ExtraLearningItem> = {
  '1': {
    title: 'Advanced Mathematics',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    duration: '2 hours',
    instructor: 'Dr. Robert Smith',
    description: `This advanced mathematics course covers complex topics including:

• Calculus
• Linear Algebra
• Number Theory
• Abstract Algebra

Students will learn through interactive problem-solving sessions and real-world applications. The course includes practice exercises and detailed explanations of mathematical concepts.`,
    category: 'Mathematics',
    level: 'Advanced',
    chapters: [
      {
        id: '1',
        title: 'Introduction to Calculus',
        subchapters: [
          {
            id: '1.1',
            title: 'Limits and Continuity',
            type: 'video',
            duration: '15 mins',
            content: 'https://www.youtube.com/watch?v=CMt5nxc1llk'
          },
          {
            id: '1.2',
            title: 'Differentiation Basics',
            type: 'pdf',
            duration: '20 pages',
            content: 'https://pdfobject.com/pdf/sample.pdf'
          }
        ]
      },
      {
        id: '2',
        title: 'Linear Algebra Fundamentals',
        subchapters: [
          {
            id: '2.1',
            title: 'Matrices and Determinants',
            type: 'video',
            duration: '20 mins',
            content: 'video_url_here'
          },
          {
            id: '2.2',
            title: 'Vector Spaces',
            type: 'pdf',
            duration: '15 pages',
            content: "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
          }
        ]
      }
    ]
  },
  '2': {
    title: 'Creative Writing Workshop',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    duration: '1.5 hours',
    instructor: 'Prof. Emily Johnson',
    description: `Enhance your creative writing skills through:

• Story Development
• Character Creation
• Plot Structure
• Narrative Techniques

This workshop includes writing exercises, peer review sessions, and guidance on developing your unique writing style.`,
    category: 'Literature',
    level: 'Intermediate',
    chapters: [
      {
        id: '1',
        title: 'Story Development',
        subchapters: [
          {
            id: '1.1',
            title: 'Plot Structure',
            type: 'video',
            duration: '25 mins',
            content: 'video_url_here'
          },
          {
            id: '1.2',
            title: 'Character Development',
            type: 'pdf',
            duration: '15 pages',
            content: 'pdf_url_here'
          }
        ]
      }
    ]
  },
  '3': {
    title: 'Physics Lab Experiments',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    duration: '3 hours',
    instructor: 'Dr. Michael Chen',
    description: `Hands-on physics experiments covering:

• Mechanics
• Electricity
• Magnetism
• Optics

Students will conduct experiments, collect data, and learn to analyze results using scientific methods.`,
    category: 'Physics',
    level: 'Intermediate',
    chapters: [
      {
        id: '1',
        title: 'Mechanics Experiments',
        subchapters: [
          {
            id: '1.1',
            title: 'Newton\'s Laws',
            type: 'video',
            duration: '30 mins',
            content: 'video_url_here'
          },
          {
            id: '1.2',
            title: 'Lab Manual',
            type: 'pdf',
            duration: '25 pages',
            content: 'pdf_url_here'
          }
        ]
      }
    ]
  }
};

export default function ExtraLearningDetail() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ExtraLearningId'>>();
  const route = useRoute();
  const { id } = route.params as RootStackParamList['ExtraLearningId'];
  const learningItem = extraLearningData[id as keyof typeof extraLearningData];
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [downloadedContent, setDownloadedContent] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDownloadedContent();
  }, []);

  const loadDownloadedContent = async () => {
    try {
      const downloaded = await SecureStore.getItemAsync('downloadedContent');
      if (downloaded) {
        setDownloadedContent(JSON.parse(downloaded));
      }
    } catch (error) {
      console.error('Error loading downloaded content:', error);
    }
  };

  const handleDownload = async (subchapter: Subchapter, chapterTitle: string) => {
    try {
      // Create a unique ID for the content
      const contentId = `${id}_${subchapter.id}`;
      
      if (subchapter.type === 'video') {
        // For videos, just save the URL
        const contentMetadata = {
          id: contentId,
          title: subchapter.title,
          chapterTitle,
          courseTitle: learningItem.title,
          type: subchapter.type,
          localUri: subchapter.content, // Store the video URL directly
          downloadDate: new Date().toISOString(),
          isVideo: true // Mark as video content
        };

        // Update downloaded content list
        const currentDownloaded = await SecureStore.getItemAsync('downloadedContent') || '{}';
        const downloadedList = JSON.parse(currentDownloaded);
        downloadedList[contentId] = contentMetadata;
        
        await SecureStore.setItemAsync('downloadedContent', JSON.stringify(downloadedList));
        setDownloadedContent(downloadedList);

        Alert.alert('Success', 'Video saved successfully!');
      } else {
        // For PDFs, download the file
        Alert.alert('Downloading...', 'Please wait while we download your PDF.');
        
        const downloadResult = await FileSystem.downloadAsync(
          subchapter.content,
          FileSystem.documentDirectory + contentId
        );

        if (downloadResult.status === 200) {
          const contentMetadata = {
            id: contentId,
            title: subchapter.title,
            chapterTitle,
            courseTitle: learningItem.title,
            type: subchapter.type,
            localUri: downloadResult.uri,
            downloadDate: new Date().toISOString(),
            isVideo: false // Mark as PDF content
          };

          // Update downloaded content list
          const currentDownloaded = await SecureStore.getItemAsync('downloadedContent') || '{}';
          const downloadedList = JSON.parse(currentDownloaded);
          downloadedList[contentId] = contentMetadata;
          
          await SecureStore.setItemAsync('downloadedContent', JSON.stringify(downloadedList));
          setDownloadedContent(downloadedList);

          Alert.alert('Success', 'PDF downloaded successfully!');
        }
      }
    } catch (error) {
      console.error('Error handling content:', error);
      Alert.alert('Error', 'Failed to process content. Please try again.');
    }
  };

  const isDownloaded = (subchapterId: string) => {
    const contentId = `${id}_${subchapterId}`;
    return !!downloadedContent[contentId];
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleContentPress = (content: string, type: string, title: string) => {
    // Handle opening content based on type
    console.log(`Opening ${type} content: ${content} - ${title}`);
    // Implement content viewing logic here
  };

  if (!learningItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Learning content not found</Text>
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
        <Text style={styles.headerTitle}>Extra Learning</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Image source={{ uri: learningItem.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{learningItem.title}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{learningItem.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Level</Text>
              <Text style={styles.infoValue}>{learningItem.level}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{learningItem.category}</Text>
            </View>
          </View>

          <View style={styles.instructorInfo}>
            <Text style={styles.instructorLabel}>Instructor</Text>
            <Text style={styles.instructorName}>{learningItem.instructor}</Text>
          </View>

          <Text style={styles.descriptionTitle}>About This Course</Text>
          <Text style={styles.description}>{learningItem.description}</Text>

          <Text style={styles.chaptersTitle}>Course Content</Text>
          {learningItem.chapters?.map(chapter => (
            <View key={chapter.id} style={styles.chapterContainer}>
              <TouchableOpacity 
                style={styles.chapterHeader}
                onPress={() => toggleChapter(chapter.id)}
              >
                {expandedChapters.includes(chapter.id) 
                  ? <ChevronDown size={20} color="#000" />
                  : <ChevronRight size={20} color="#000" />
                }
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </TouchableOpacity>
              
              {expandedChapters.includes(chapter.id) && (
                <View style={styles.subchaptersContainer}>
                  {chapter.subchapters.map(subchapter => (
                    <TouchableOpacity 
                      key={subchapter.id}
                      style={styles.subchapterItem}
                      onPress={() => handleContentPress(subchapter.content, subchapter.type, subchapter.title)}
                    >
                      {subchapter.type === 'video' 
                        ? <PlayCircle size={20} color="#007AFF" />
                        : <FileText size={20} color="#007AFF" />
                      }
                      <View style={styles.subchapterInfo}>
                        <Text style={styles.subchapterTitle}>{subchapter.title}</Text>
                        <Text style={styles.subchapterDuration}>{subchapter.duration}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDownload(subchapter, chapter.title)}
                        style={styles.downloadButton}
                      >
                        {isDownloaded(subchapter.id) 
                          ? <Check size={20} color="#34C759" />
                          : <Download size={20} color="#666" />
                        }
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
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
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#000',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#000',
  },
  instructorInfo: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  instructorLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  instructorName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  descriptionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
  description: {
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
  chaptersTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#000',
    marginTop: 24,
    marginBottom: 16,
  },
  chapterContainer: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chapterTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  subchaptersContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  subchapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  subchapterInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  subchapterTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  subchapterDuration: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  downloadButton: {
    padding: 8,
  },
}); 