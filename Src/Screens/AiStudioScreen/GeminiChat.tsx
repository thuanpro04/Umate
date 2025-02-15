import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import React, {useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {globalStyles} from '../../Styles/globalStyle';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import {authSelector} from '../../redux/reducers/authReducer';
import {HeaderComponent} from '../Components';
import {generateAIResponse} from '../Services/generateAiService';
import ChatBox from './ChatBox';
import InputGenimi from './InputGenimi';
import {StatusBar} from 'react-native';

const GeminiChat = ({
  onFocus,
  onBlur,
}: {
  onFocus: () => void;
  onBlur: () => void;
}) => {
  const [userInput, setUserInput] = useState('');
  const [messageInfo, setMessageInfo] = useState<any[]>([]);
  const [isDisable, setDisable] = useState(false);
  const navigation = useNavigation();
  const auth = useSelector(authSelector);

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
    <KeyboardAvoidingView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <HeaderComponent
          title="Gemini Chat"
          titleColor={appColors.white}
          iconLeft={
            <ArrowLeft size={appInfo.sizeIconBold} color={appColors.white} />
          }
          onPress1={() => navigation.goBack()}
        />

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
    backgroundColor: '#121212', // Màu nền chính
    paddingBottom: 10,
    paddingHorizontal: 12,
    marginTop: StatusBar.currentHeight,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#1E1E1EFA',
    borderRadius: 16,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GeminiChat;
