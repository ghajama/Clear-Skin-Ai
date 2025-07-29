import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { H2, Body } from "@/components/ui/Typography";
import { colors, spacing } from "@/constants/theme";
import { Button } from "@/components/ui/Button";
import { QuizCard } from "@/components/onboarding/QuizCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useLocalSearchParams, router } from "expo-router";
import { quizQuestions } from "@/constants/mockData";
import { useSkincare } from "@/hooks/useSkincare";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const questionId = id || "1";
  const questionIndex = parseInt(questionId) - 1;
  const { quizAnswers, saveQuizAnswer, completeQuiz } = useSkincare();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(
    quizAnswers[questionId] || null
  );

  const question = quizQuestions[questionIndex];
  const isLastQuestion = questionIndex === quizQuestions.length - 1;
  const progress = (questionIndex + 1) / quizQuestions.length;

  useEffect(() => {
    // Reset selected option when question changes
    setSelectedOption(quizAnswers[questionId] || null);
  }, [questionId, quizAnswers]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption) {
      saveQuizAnswer(questionId, selectedOption);
      
      if (isLastQuestion) {
        completeQuiz();
        router.push("/onboarding/analysis");
      } else {
        const nextQuestionId = (parseInt(questionId) + 1).toString();
        router.push(`/onboarding/quiz/${nextQuestionId}`);
      }
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      const prevQuestionId = (parseInt(questionId) - 1).toString();
      router.push(`/onboarding/quiz/${prevQuestionId}`);
    } else {
      router.back();
    }
  };

  if (!question) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <Body style={styles.progressText}>
            Question {questionIndex + 1} of {quizQuestions.length}
          </Body>
          <ProgressBar progress={progress} />
        </View>

        <H2 style={styles.question}>{question.question}</H2>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <QuizCard
              key={option.id}
              option={option}
              selected={selectedOption === option.id}
              onSelect={handleOptionSelect}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={isLastQuestion ? "Finish" : "Next"}
            onPress={handleNext}
            disabled={!selectedOption}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressText: {
    marginBottom: spacing.s,
    color: colors.text.secondary,
  },
  question: {
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  button: {
    flex: 0.48,
  },
});