import React from 'react';
import { View, StyleSheet } from 'react-native';
import TodayNews from './TodayNews';



export default function TodayNewsScreen() {
  return (
    <View style={styles.container}>
      <TodayNews/>
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