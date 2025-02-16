import chatsAPI from '../../apis/chatApi';

const getAllMessagesUser = async (id: any, key: string, page: number) => {
  try {
    const url = `/receive-messages?id=${id}&key=${key}&page=${page}`;

    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllMessagesUser', error);
  }
};
const checkConversation = async (senderId: string, receiverId: string) => {
  const url = '/new-conversation';
  let data = {
    senderId,
    receiverId,
  };

  try {
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.error('create conversation fail ', error);
  }
};
const getAllConversationUsers = async (currentUserId: string) => {
  const url = `/get-all-conversation?currentUserId=${currentUserId}`;
  // console.log(url);

  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllConversationUsers', error);
  }
};
const updateStatusMessage = async (userId: string, id: string, key: string) => {
  const url = `/update-status-message?userId=${userId}&&id=${id}`;
  const data = {
    userId,
    id,
    key,
  };
  const res = await chatsAPI.handleChats(url,data,'post');
  return res;
};
export const messageServices = {
  getAllMessagesUser,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,
};
