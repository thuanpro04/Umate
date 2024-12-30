import {StatusBar, StyleSheet} from 'react-native';
import {appColors} from '../../Theme/Colors/appColors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    alignItems: 'center',
    height: '35%',
  },
  profileContainer: {
    alignItems: 'center',
    height: '32%',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.white,
    marginBottom: 10,
  },
  majoring: {
    fontSize: 16,
    color: '#fff',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginLeft: 10,
    color: appColors.blue,
  },
  email: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
  },
  bio: {
    fontSize: 14,
    color: appColors.grey2,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  postList: {
    paddingHorizontal: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
  },
  postContent: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  btn_Detail: {
    color: appColors.grey2,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
    borderColor: appColors.white,
  },
  infoContainer: {
    marginLeft: 20,
    flex: 1,
    
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'coral',
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    paddingHorizontal: 35,
    justifyContent: 'center',
  },

  genderRow: {
    justifyContent: 'space-evenly',
    flex: 1,
  },
  buttonStyles: {
    borderWidth: 0.3,
    padding: 8,
    borderRadius: 12,
  },
  italicText: {
    fontStyle: 'italic',
  },
});
