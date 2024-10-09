import {Users} from './friendService.'; // Giả sử đây là nơi bạn thực hiện các yêu cầu API

const handlePressRemoveSuggested = async (
  usersID: string,
  currentUserID: string,
) => {
  const url = '/remove-suggested-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await Users.getUsers(url, data, 'post');
  console.log(res);
  return res?.data;
};
const handleRemoveFriends = async (usersID: string, currentUserID: string) => {
  const url = '/remove-friend';
  const data = {friendUserID: usersID, currentUserID};
  const res = await Users.getUsers(url, data, 'post');
 return res?.data;
  
};
export const userServices = {
  handlePressRemoveSuggested,
  handleRemoveFriends,
};
