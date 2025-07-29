import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  FlatList,
  SafeAreaView
} from "react-native";
import { H2, Body } from "@/components/ui/Typography";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { QuickPrompt } from "@/components/chat/QuickPrompt";
import { Send } from "lucide-react-native";

export default function ChatScreen() {
  const { messages, loading, sendMessage, availablePrompts } = useChat();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handlePromptPress = (text: string) => {
    sendMessage(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <H2>AI Skincare Assistant</H2>
        </View>
        
        <View style={styles.promptsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsScroll}
          >
            {availablePrompts.map(prompt => (
              <QuickPrompt 
                key={prompt.id} 
                prompt={prompt} 
                onPress={handlePromptPress} 
              />
            ))}
          </ScrollView>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <Body style={styles.loadingText}>Thinking...</Body>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Send size={20} color={inputText.trim() ? colors.text.light : colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    padding: spacing.l,
    paddingBottom: spacing.m,
  },
  promptsContainer: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  promptsScroll: {
    paddingRight: spacing.l,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.l,
    paddingTop: 0,
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  loadingText: {
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
  },
  sendButtonDisabled: {
    backgroundColor: colors.secondary,
  },
});