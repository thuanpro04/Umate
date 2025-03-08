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
import { ImageIcon } from 'lucide-react-native';

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
const MenuChat = (colors) => {
  
  const Categorys = [
    {
      key: 1,
      title: 'Tùy chỉnh đoạn chat',
      icon: <Designtools color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 1,
          label: 'Đổi chủ đề',
          icon: (
            <MaterialCommunityIcons
              name="cookie-edit-outline"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 2,
          label: 'Thay đổi biệt danh',
          icon: (
            <MaterialCommunityIcons
              name="human-edit"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
      ],
    },
    {
      key: 2,
      title: 'Xem ảnh và link',
      icon: <HuobiToken color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 3,
          label: 'Your Images',
          icon: <ImageIcon color={colors.icon} size={appInfo.sizeIcon} />,
        },
        {
          id: 4,
          label: 'Link liên kết',
          icon: <Link21 color={colors.icon} size={appInfo.sizeIcon} />,
        },
      ],
    },
    {
      key: 3,
      title: 'Quyền riêng tư && hỗ trợ',
      icon: <SecurityUser color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 5,
          label: 'Block',
          icon: (
            <FontAwesome6
              name="user-xmark"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 6,
          label: 'Báo cáo',
          icon: (
            <Octicons
              name="report"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
      ],
    },
  ];
  const ChoiceItems = [
    {
      key: 'personal',
      name: 'Personal',
      icon: (
        <Personalcard size={appInfo.sizeIconBold} color={appColors.cobalt} />
      ),
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
  return {
    ChoiceItems,
    Categorys,
  };
};

export {MenuItems, MenuChat};
