import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {generateAIResponse} from '../Services/generateAiService';
const GeminiChat = () => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAIResponse] = useState<any>('');
  const handleGenerateResponse = async () => {
    try {
      const response = await generateAIResponse(userInput);
      setAIResponse(response);
    } catch (error) {
      setAIResponse('Failed to fetch response. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your question for AI..."
        value={userInput}
        onChangeText={setUserInput}
      />
      <Button title="Send" onPress={handleGenerateResponse} />
      <Text style={styles.response}>AI Response: {aiResponse}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color:'black'
  },
  response: {marginTop: 20, fontSize: 16, color:'coral'},
});

export default GeminiChat;
