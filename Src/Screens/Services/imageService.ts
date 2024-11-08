import storage from '@react-native-firebase/storage';
const uploadImageToFirebase = async (filePath: string, path: string) => {
  const res = await storage().ref(path).putFile(filePath);
  return await storage().ref(path).getDownloadURL();
};
const deleteImageToFirebase = async (path: string) => {
  return storage().ref(path).delete();
};
export const imageService = {
  uploadImageToFirebase,
  deleteImageToFirebase
};
