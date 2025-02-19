import notificationAPI from '../../apis/notificationApi';

const actionNotificationUser = async (
  userId: string,
  converId: string,
  key: string,
) => {
  const url = `/action-notifi`;
  const data = {userId, converId, key};
  const res = await notificationAPI.handleNotification(url, data, 'post');
  return res;
};
const inviteToGroup = async (userId: string[], currentUserId: string, groupName:string) => {
  const url = '/invite-group';
  const data = {
    currentUserId,
    userId,
    content:`Mọi cuộc vui đều thiếu sót nếu không có bạn! Vào nhóm ${groupName}cùng trải nghiệm nhé!🔥`
  };
  const res = await notificationAPI.handleNotification(url, data, 'post');
  return res;
};
export const notificationServices = {actionNotificationUser, inviteToGroup};
