import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {generateAIResponse} from '../Services/generateAiService';
import ChatBox from './ChatBox';
import InputGenimi from './InputGenimi';
import LinearGradient from 'react-native-linear-gradient';

const GeminiChat = ({onFocus, onBlur}: any) => {
  const [userInput, setUserInput] = useState('');
  const [messageInfo, setMessageInfo] = useState<any[]>([]);
  const [isDisable, setDisable] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      onFocus?.();
      return () => onBlur?.();
    }, [onBlur, onFocus]),
  );

  const handleGenerateResponse = async () => {
    if (!userInput) return;

    const userMessage = {
      id: Date.now(),
      content: userInput,
      reply: null,
      imagesUrl: [],
      timestamp: new Date().toISOString(),
      isUser: true,
    };

    setMessageInfo(prev => [...prev, userMessage]);
    setDisable(true);

    try {
      const aiResponse = await generateAIResponse(userInput);
      const aiMessage = {
        id: Date.now() + 1,
        content: aiResponse,
        reply: null,
        imagesUrl: [],
        timestamp: new Date().toISOString(),
      };
      setMessageInfo(prev => [...prev, aiMessage]);
    } catch (error) {
      console.log('Error:', error);
    }

    setDisable(false);
    setUserInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#3E4EB8', '#1C1F57']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowLeft size={28} color={appColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gemini Chat</Text>
        </LinearGradient>

        {/* Chat Box */}
        <View style={styles.chatContainer}>
          <ChatBox messbox={messageInfo} />
        </View>

        {/* Input */}
        <InputGenimi
          onChangeValue={setUserInput}
          isDisable={isDisable}
          value={userInput}
          onPress={handleGenerateResponse}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0F1F',
    paddingBottom: 12,
    paddingHorizontal: 14,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.white,
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#1D1E33',
    borderRadius: 18,
    padding: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default GeminiChat;
