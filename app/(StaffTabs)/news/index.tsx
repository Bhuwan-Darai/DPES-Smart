import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TopBar from '@/components/TopBar';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

export default function NewsScreen() {

  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'NewsId'>>();
  const router = useRouter();

  const news = [
    {
      id: '1',
      title: 'Annual Science Fair Coming Soon',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      date: 'March 15, 2024',
      preview: 'Get ready for the biggest science event of the year...',
    },
    {
      id: '2',
      title: 'Sports Day Registration Open',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
      date: 'March 12, 2024',
      preview: 'Register now for various sports competitions...',
    },
    {
      id: '3',
      title: 'New Library Resources Available',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
      date: 'March 10, 2024',
      preview: 'Check out our new collection of digital resources...',
    },
  ];

  return (
    <View style={styles.container}>
      <TopBarStaff
      />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Latest Updates</Text>
        {news.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.newsCard}
            // onPress={() => navigation.navigate('NewsId', {
            //   id: item.id,
            //   title: item.title,
            //   image: item.image,
            //   date: item.date,
            //   preview: item.preview
            // })}
            onPress={() => router.push({
              pathname: '/news/[id]',
              params: {
                id: item.id,
                title: item.title,
                image: item.image,
                date: item.date,
                preview: item.preview,
              },
            })}
          >
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <Text style={styles.newsDate}>{item.date}</Text>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsPreview}>{item.preview}</Text>
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
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: '#000',
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 16,
  },
  newsDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  newsTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
  },
  newsPreview: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});