import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ChapterDetailScreen = ({ route }) => {
  const { chapter } = route.params; // Nhận chương được truyền từ StoryDetailScreen

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chapterTitle}>{chapter.title}</Text>
      <Text style={styles.chapterContent}>{chapter.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterContent: {
    fontSize: 16,
    color: '#333',
  },
});

export default ChapterDetailScreen;
