import chatsAPI from '../../apis/chatApi';

const getAllMessagesUser = async (currentUserID: string, userID:string) => {
  const url = `/receive-messages?senderID=${currentUserID}&receiverID=${userID}`;
  console.log(url);
  
  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllMessagesUser', error);
  }
};
const getAllConversationUsers = async (currentUserID: string) => {
  const url = `/get-all-conversation?currentUserID=${currentUserID}`;
  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllConversationUsers', error);
  }
};

export const messageServices = {
  getAllMessagesUser,
  getAllConversationUsers,
  
};
