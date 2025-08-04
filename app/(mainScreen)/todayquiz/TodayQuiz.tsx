import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const sampleQuizzes: { [key: string]: QuizQuestion[] } = {
  '2024-03-15': [
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
    },
  ],
  '2024-03-16': [
    {
      id: '1',
      question: 'What is the chemical symbol for gold?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      correctAnswer: 1,
    },
  ],
};

const QuizQuestion = ({ question, selectedAnswer, onSelectAnswer }: { 
  question: QuizQuestion, 
  selectedAnswer: number | null,
  onSelectAnswer: (index: number) => void 
}) => {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption
            ]}
            onPress={() => onSelectAnswer(index)}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === index && styles.selectedOptionText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function TodayQuiz() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});

  const dateString = date.toISOString().split('T')[0];
  const quizQuestions = sampleQuizzes[dateString] || [];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedAnswers({});
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.dateSelector}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateSelectorText}>
          Select Date: {dateString}
        </Text>
      </TouchableOpacity>

      {/* {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )} */}

      {quizQuestions.length > 0 ? (
        quizQuestions.map(question => (
          <QuizQuestion
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id] ?? null}
            onSelectAnswer={(index) => handleAnswerSelect(question.id, index)}
          />
        ))
      ) : (
        <Text style={styles.noQuizText}>No quiz available for this date</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  dateSelector: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  noQuizText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    marginTop: 32,
  },
}); 