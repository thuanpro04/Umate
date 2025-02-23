import {
  CallCalling,
  Designtools,
  Heart,
  HuobiToken,
  Link21,
  Logout,
  Message,
  Personalcard,
  SecurityUser,
  Setting2,
  Sms,
  User,
  Video,
  Image,
  People,
} from 'iconsax-react-native';
import {appInfo} from '../Theme/appInfo';
import {appColors} from '../Theme/Colors/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';

const size = appInfo.sizeIcon;
const color = appColors.blue2;
const MenuItems = [
  {
    key: 'profile',
    title: 'My Profile',
    icon: <User size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'friends',
    title: 'Friends',
    icon: <People size={size} color={color} variant="Bulk" />,
  },

  {
    key: 'settings',
    title: 'Settings',
    icon: <Setting2 name="sign-out" size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'signOut',
    title: 'Sign Out',
    icon: <Logout name="sign-out" size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'contactUs',
    title: 'Contact Us',
    icon: <Sms size={size} color={color} variant="Bulk" />,
  },
];

const ChoiceItems = [
  {
    key: 'call',
    name: 'Call',
    icon: <CallCalling size={appInfo.sizeIconBold} color={appColors.cobalt} />,
  },
  {
    key: 'video',
    name: 'Video',
    icon: <Video size={appInfo.sizeIconBold} color={appColors.cobalt} />,
  },
  {
    key: 'personal',
    name: 'Personal',
    icon: <Personalcard size={appInfo.sizeIconBold} color={appColors.cobalt} />,
  },
  {
    key: 'notification',
    name: 'Notification',
    icon: (
      <Ionicons
        name="notifications-outline"
        size={appInfo.sizeIconBold}
        color={appColors.cobalt}
      />
    ),
  },
];

export {MenuItems, ChoiceItems};
