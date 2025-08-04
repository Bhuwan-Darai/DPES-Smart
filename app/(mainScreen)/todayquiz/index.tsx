import React from 'react';
import { View, StyleSheet } from 'react-native';
import TodayQuiz from './TodayQuiz';



export default function TodayQuizScreen() {
  return (
    <View style={styles.container}>
      <TodayQuiz />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
}); 