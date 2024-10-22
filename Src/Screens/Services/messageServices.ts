import chatsAPI from '../../apis/chatApi';

const getAllMessagesUser = async (url: string) => {
  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllMessagesUser', error);
  }
};
const getAllConversationUsers = async (url: string) => {
  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllConversationUsers', error);
  }
};
const searchConversationUsers = async (url: string) => {
  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getConversationusers', error);
  }
};
export const messageServices = {
  getAllMessagesUser,
  getAllConversationUsers,
  searchConversationUsers,
};
