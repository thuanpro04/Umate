import chatsAPI from '../../apis/chatApi';

const getAllMessagesUser = async (
  currentUserID: string,
  userID?: string,
  recipients?: string[],
  groupID?: string,
  newPage?:number
) => {
  const url = `/receive-messages?senderID=${currentUserID}&receiverID=${userID}&recipients=${recipients}&groupID=${groupID}&page=${newPage}`;
  try {
    console.log(url);
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
