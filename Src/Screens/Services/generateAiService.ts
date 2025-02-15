import axios from 'axios';

const BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = 'AIzaSyAbxfbD6MeuGrKqvbJmWOvNJCEXNfFAWdM';
export const generateAIResponse = async (textInput: string) => {
  

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: textInput, // Văn bản đầu vào
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log('generate ai erorr', error);
  }
};
