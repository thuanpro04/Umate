import notificationAPI from '../../apis/notificationApi';
let url;
const actionNotificationUser = async (
  userId: string,
  converId: string,
  key: string,
) => {
  try {
    url = `/action-notifi`;
    const data = {userId, converId, key};
    const res = await notificationAPI.handleNotification(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Action notification fail error: ', error);
  }
};
const inviteToGroup = async (
  id: any,
  userId: string[],
  currentUserId: string,
  groupName: string,
) => {
  try {
    url = '/invite-group';
    const data = {
      id,
      currentUserId,
      userId,
      content: 'group_invite_message',
      title: groupName,
    };
    const res = await notificationAPI.handleNotification(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Invite to group error: ', error);
  }
};
const getNotifications = async (userId: string) => {
  try {
    url = `/get-notifi?userId=${userId}`;
    const res = await notificationAPI.handleNotification(url);
    return res;
  } catch (error) {
    console.log('fetch notification error: ', error);
  }
};
const handleDeleteNotification = async (id: string | string[]) => {
  try {
    url = `/delete?id=${id}`;
    const res = await notificationAPI.handleNotification(url);
    return res;
  } catch (error) {
    console.log('Trash notification error: ', error);
  }
};
const handleSendEmail = async (data: any) => {
  try {
    const res = await notificationAPI.handleNotification(
      '/send-email',
      data,
      'post',
    );
    return res;
  } catch (error) {
    console.log('handle email fail error: ', error);
  }
};
export const notificationServices = {
  actionNotificationUser,
  inviteToGroup,
  getNotifications,
  handleDeleteNotification,
  handleSendEmail,
};
