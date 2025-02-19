import searchAPI from '../../apis/searchApi';

const handleSearchFriends = async (
  currentUserId: string,
  keySearch: string,
  titleSearch: string[],
) => {
  const url = `/search?currentUserId=${currentUserId}&searchTerm=${keySearch}&titleSearch=${titleSearch}`;
  try {
    const res = await searchAPI.handleSearch(url);
    return res;
  } catch (error) {
    console.log('handleSearchFriends', error);
  }
};
const searchConversationUsers = async (
  currentUserId: string,
  keySearch: string,
) => {
  const url = `/search-conversations?currentUserId=${currentUserId}&keyWord=${keySearch}`;

  try {
    const res = await searchAPI.handleSearch(url);
    return res;
  } catch (error) {
    console.log('getConversationusers', error);
  }
};
const findFriendForUser = async (userId: string, keyWord: string) => {
  const url = `/find-friend?userId=${userId}&&keyWord=${keyWord}`;
  const res = await searchAPI.handleSearch(url);
  return res;
};
export const searchServices = {
  handleSearchFriends,
  searchConversationUsers,
  findFriendForUser,
};
