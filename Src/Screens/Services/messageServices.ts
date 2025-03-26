import chatsAPI from '../../apis/chatApi';
let url: string;
const getAllMessagesUser = async (id: any, key: string, page: number) => {
  try {
    url = `/receive-messages?id=${id}&key=${key}&page=${page}`;
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllMessagesUser', error);
  }
};
const checkConversation = async (senderId: string, receiverId: string) => {
  url = '/new-conversation';
  let data = {
    senderId,
    receiverId,
  };
  try {
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.error('Check conversation fail ', error);
  }
};
const getAllConversationUsers = async (
  currentUserId: string,
  page?: number,
) => {
  url = `/get-all-conversation?currentUserId=${currentUserId}&&page=${
    page ?? 1
  }`;

  try {
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('getAllConversationUsers', error);
  }
};
const updateStatusMessage = async (userId: string, id: string, key: string) => {
  url = `/update-status-message?userId=${userId}&&id=${id}`;
  try {
    const data = {
      userId,
      id,
      key,
    };
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.log('update status message fail: ', error);
  }
};
const deleteConversation = async (arrConver: any) => {
  try {
    url = '/delete-conver';
    const res = await chatsAPI.handleChats(url, arrConver, 'post');
    return res;
  } catch (error) {
    console.log('Delete conversation fail: ', error);
  }
};
const getImages = async (conversationId: string, type: string) => {
  try {
    url = `/get-images?id=${conversationId}&&type=${type}`;
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('Get images fail: ', error);
  }
};
const getLinkYourConversation = async (
  conversationId: string,
  type: string,
) => {
  try {
    url = `/get-link?id=${conversationId}&&type=${type}`;
    const res = await chatsAPI.handleChats(url);
    return res;
  } catch (error) {
    console.log('get link error: ', error);
  }
};
const updateNickNameConversation = async (data: any) => {
  try {
    url = '/update-nickname';
    if (!data.id) {
      return;
    }
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Update nick name fail: ', error);
  }
};
const updateThemeConversation = async (
  id: string,
  theme: string,
  key: string,
) => {
  try {
    url = '/update-theme';
    const res = await chatsAPI.handleChats(url, {id, theme, key}, 'post');
    return res;
  } catch (error) {
    console.log('Theme conversation error: ', error);
  }
};
const updateAttendedGroup = async (data: any) => {
  try {
    url = '/update-attend';
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Atteded group error: ', error);
  }
};
const actionGhimConversation = async (
  id: string,
  userId: string,
  key: string,
) => {
  const data = {
    id,
    userId,
    key,
  };
  url = '/ghim';
  try {
    const res = await chatsAPI.handleChats(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Ghim fail: ', error);
  }
};
export const messageServices = {
  getAllMessagesUser,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,
  deleteConversation,
  getImages,
  getLinkYourConversation,
  updateNickNameConversation,
  updateThemeConversation,
  updateAttendedGroup,
  actionGhimConversation,
};
