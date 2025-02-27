import eventApi from '../../apis/eventApi';
let url;
const getNewEvent = async (page: number) => {
  url = `/new-event?curentPage=${page}&limit=${10}`;


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
  url = `/action-heart?userId=${userId}&id=${id}&key=${action}`;
  const res = eventApi.handleEvent(url);
  return res;
};
const shareEventMyApp = async (data: any) => {
  url = `/share-event`;
  try {
    const res = eventApi.handleEvent(url, data, 'post');
    return res;
  } catch (error) {
    console.log('Share event error: ', error);
  }
};
const getEventShared = async (events: any) => {
  url = '/get-event';
  try {
    const res = await eventApi.handleEvent(url, events, 'post');
    return res;
  } catch (error) {
    console.log('Get event shared error: ', error);
  }
};
export const eventSevices = {
  getNewEvent,
  updateUserHeartForEvent,
  shareEventMyApp,
  getEventShared,
};
