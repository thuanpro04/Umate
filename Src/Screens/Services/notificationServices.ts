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
export const notificationServices = {actionNotificationUser};
