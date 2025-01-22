import eventApi from '../../apis/eventApi';

const getNewEvent = async (page: number) => {
  const url = `/new-event?curentPage=${page}&limit=${10}`;
  console.log(url);

  try {
    const response = await eventApi.handleEvent(url);
    return response;
  } catch (error) {
    console.error('get event fail ', error);
  }
};
const updateUserHeartForEvent = async (
  userId: string,
  id: string,
  action: 'add' | 'cancel',
) => {
  const url = `/action-heart?userId=${userId}&eventId=${id}&key=${action}`;
  const res = eventApi.handleEvent(url);
  return res;
};
export const eventSevices = {getNewEvent, updateUserHeartForEvent};
