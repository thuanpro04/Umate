import notificationAPI from '../../apis/notificationApi';
let url;
const actionNotificationUser = async (
  userId: string,
  converId: string,
  key: string,
) => {
  url = `/action-notifi`;
  const data = {userId, converId, key};
  const res = await notificationAPI.handleNotification(url, data, 'post');
  return res;
};
const inviteToGroup = async (
  id: any,
  userId: string[],
  currentUserId: string,
  groupName: string,
) => {
  url = '/invite-group';
  const data = {
    id,
    currentUserId,
    userId,
    content: `Mọi cuộc vui đều thiếu sót nếu không có bạn! Vào nhóm ${groupName}cùng trải nghiệm nhé!🔥`,
  };
  const res = await notificationAPI.handleNotification(url, data, 'post');
  return res;
};
const getNotifications = async (userId: string) => {
  url = `/get-notifi?userId=${userId}`;
  const res = await notificationAPI.handleNotification(url);
  return res;
};
const handleDeleteNotification = async (id: string| string[]) => {
  url = `/delete?id=${id}`;
  const res = await notificationAPI.handleNotification(url);
  return res;
};
const handleSendEmail = async (data: any) => {
  const res = await notificationAPI.handleNotification(
    '/send-email',
    data,
    'post',
  );
  return res;
};
export const notificationServices = {
  actionNotificationUser,
  inviteToGroup,
  getNotifications,
  handleDeleteNotification,
  handleSendEmail,
};
