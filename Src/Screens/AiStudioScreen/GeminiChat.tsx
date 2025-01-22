import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import axios from 'axios';
import {generateAIResponse} from '../Services/generateAiService';
import {globalStyles} from '../../Styles/globalStyle';
import {HeaderComponent} from '../Components';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native';
import {appColors} from '../../Theme/Colors/appColors';
import {appInfo} from '../../Theme/appInfo';
import LinearGradient from 'react-native-linear-gradient';
import ChatInput from '../Messages/Component/ChatInput';
import ChatItems from '../Messages/Component/ChatItems';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/reducers/authReducer';
import ChatBox from './ChatBox';
import InputGenimi from './InputGenimi';
interface Root {
  content: string;
  reply: any;
  imagesUrl: any[];
  timestamp: string;
}

const GeminiChat = ({
  onFocus,
  onBlur,
}: {
  onFocus: () => void;
  onBlur: () => void;
}) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAIResponse] = useState<any>('');
  const [messageInfo, setMessageInfo] = useState<any[]>([]);
  const navigation = useNavigation();
  const [isDisable, setDisable] = useState(false);
  const auth = useSelector(authSelector);
  useFocusEffect(
    useCallback(() => {
      if (onFocus) {
        onFocus();
      }
      return () => {
        if (onBlur) {
          onBlur();
        }
      };
    }, [onBlur, onFocus]),
  );

  const onChangeContent = (value: string) => {
    setUserInput(value);
  };
  const handleGenerateResponse = async () => {
    if (!userInput) {
      return;
    }
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
    console.log(userInput);

    try {
      const aiResponse = await generateAIResponse(userInput);
      // Thêm phản hồi AI vào danh sách
      const aiMessage = {
        id: Date.now() + 1,
        content: aiResponse,
        reply: null,
        imagesUrl: [],
        timestamp: new Date().toISOString(),
      };
      setMessageInfo(prev => [...prev, aiMessage]);
    } catch (error) {
      setAIResponse('Failed to fetch response. Please try again.');
    }
    setDisable(false);
    setUserInput('');
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <SafeAreaView
        style={[
          globalStyles.container,
          {
            paddingBottom: 10,
            paddingHorizontal: 12,
          },
        ]}>
        <HeaderComponent
          title="Genimi chat"
          titleColor={appColors.blueBack}
          iconLeft={
            <ArrowLeft size={appInfo.sizeIconBold} color={appColors.blueBack} />
          }
          onPress1={() => navigation.goBack()}
        />
        <ChatBox messbox={messageInfo} />
        <InputGenimi
          onChangeValue={onChangeContent}
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
    color: 'black',
  },
  response: {marginTop: 20, fontSize: 16, color: 'coral'},
});

export default GeminiChat;
