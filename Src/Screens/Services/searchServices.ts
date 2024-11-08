import searchAPI from '../../apis/searchApi';

const handleSearchFriends = async (
  currentUserID: string,
  keySearch: string,
  titleSearch: string[],
) => {
  const url = `/search?currentUserID=${currentUserID}&searchTerm=${keySearch}&titleSearch=${titleSearch}`;
  try {
    const res = await searchAPI.handleSearch(url);
    return res;
  } catch (error) {
    console.log('handleSearchFriends', error);
  }
};
const searchConversationUsers = async (
  currentUserID: string,
  keySearch: string,
) => {
  const url = `/search-conversations?currentUserID=${currentUserID}&keyWord=${keySearch}`;

  try {
    const res = await searchAPI.handleSearch(url);
    return res;
  } catch (error) {
    console.log('getConversationusers', error);
  }
};

export const searchServices = {
  handleSearchFriends,
  searchConversationUsers,
};
