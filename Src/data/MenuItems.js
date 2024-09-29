import {Heart, Logout, Message, Setting2, Sms, User} from 'iconsax-react-native';
import {appInfo} from '../Theme/appInfo';
import {appColors} from '../Theme/Colors/appColors';
const size = appInfo.sizeIcon;
const color = appColors.blue;
export const MenuItems = [
  {
    key: 'profile',
    title: 'My Profile',
    icon: <User size={size} color={color} variant='Bulk' />,
  },
  {
    key: 'message',
    title: 'Message',
    icon: <Message size={size} color={color} variant='Bulk' />,
  },
  {
    key: 'group',
    title: 'My Group',
    icon: <Heart size={size} color={color} variant='Bulk'  />,
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: <Setting2 name="sign-out" size={size} color={color} variant='Bulk' />,
  },
  {
    key: 'signOut',
    title: 'Sign Out',
    icon: <Logout name="sign-out" size={size} color={color} variant='Bulk' />,
  },
  {
    key: 'contactUs',
    title: 'Contact Us',
    icon: <Sms size={size} color={color} variant='Bulk' />,
  },
];
