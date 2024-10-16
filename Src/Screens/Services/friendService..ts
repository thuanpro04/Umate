import { userServices } from './userService';
const handlePressRemoveSuggested = async (
  usersID: string,
  currentUserID: string,
) => {
  const url = '/remove-suggested-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await userServices.getUsers(url, data, 'post');
  console.log(res);
  return res?.data;
};
const handleRemoveFriends = async (usersID: string, currentUserID: string) => {
  const url = '/remove-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await userServices.getUsers(url, data, 'post');
 return res?.data;
  
};
export const friendServices = {
  handlePressRemoveSuggested,
  handleRemoveFriends,
};
