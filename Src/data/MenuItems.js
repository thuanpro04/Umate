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
  UserAdd,
  Message2,
} from 'iconsax-react-native';
import {appInfo} from '../Theme/appInfo';
import {appColors} from '../Theme/Colors/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import {Flag, ImageIcon, ShieldOff, UserCheck, UserX, ZoomOut} from 'lucide-react-native';

const size = appInfo.sizeIcon;
const color = appColors.blue2;
const MenuItems = [
  {
    key: 'personal',
    title: 'personal',
    icon: <User size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'friends',
    title: 'friend',
    icon: <People size={size} color={color} variant="Bulk" />,
  },

  {
    key: 'settings',
    title: 'setting',
    icon: <Setting2 name="sign-out" size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'signOut',
    title: 'signout',
    icon: <Logout name="sign-out" size={size} color={color} variant="Bulk" />,
  },
  {
    key: 'contactUs',
    title: 'contact',
    icon: <Sms size={size} color={color} variant="Bulk" />,
  },
];
const MenuChat = colors => {
  const CategoryPersonal = [
    {
      key: 1,
      title: 'customize_chat',
      icon: <Designtools color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'topic',
          label: 'change_theme',
          icon: (
            <MaterialCommunityIcons
              name="cookie-edit-outline"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 'nickname',
          label: 'change_nickname',
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
      title: 'view_photos_links',
      icon: <HuobiToken color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'images',
          label: 'yourimage',
          icon: <ImageIcon color={colors.icon} size={appInfo.sizeIcon} />,
        },
        {
          id: 'link',
          label: 'yourlink',
          icon: <Link21 color={colors.icon} size={appInfo.sizeIcon} />,
        },
      ],
    },
    {
      key: 3,
      title: 'privacy_support',
      icon: <SecurityUser color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'block',
          label: 'block',
          icon: (
            <FontAwesome6
              name="user-xmark"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 'report',
          label: 'report',
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
  const CategoryGroup = [
    {
      key: 1,
      title: 'customize_chat',
      icon: <Designtools color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'topic',
          label: 'change_theme',
          icon: (
            <MaterialCommunityIcons
              name="cookie-edit-outline"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 'nickname',
          label: 'change_nickname',
          icon: (
            <MaterialCommunityIcons
              name="human-edit"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 'qrcode',
          label: 'create_QR',
          icon: (
            <MaterialCommunityIcons
              name="qrcode-scan"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
      ],
    },
    {
      key: 2,
      title: 'view_photos_links',
      icon: <HuobiToken color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'images',
          label: 'yourimage',
          icon: <ImageIcon color={colors.icon} size={appInfo.sizeIcon} />,
        },
        {
          id: 'link',
          label: 'yourlink',
          icon: <Link21 color={colors.icon} size={appInfo.sizeIcon} />,
        },
      ],
    },
    {
      key: 3,
      title: 'privacy_support',
      icon: <SecurityUser color={colors.icon} size={appInfo.sizeIconBold} />,
      Object: [
        {
          id: 'outgroup',
          label: 'leave_group',
          icon: (
            <FontAwesome6
              name="user-xmark"
              color={colors.icon}
              size={appInfo.sizeIcon}
            />
          ),
        },
        {
          id: 'report',
          label: 'report',
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
      name: 'personal',
      icon: (
        <Personalcard size={appInfo.sizeIconBold} color={appColors.cobalt} />
      ),
    },
    {
      key: 'notification',
      name: 'notification',
      icon: (
        <Ionicons
          name="notifications-outline"
          size={appInfo.sizeIconBold}
          color={appColors.cobalt}
        />
      ),
    },
  ];
  const attributeMember = [
    {
      id: 'report',
      name: 'Báo cáo',
      icon: <Flag color={'red'} size={18} />,
    },
    {
      id: 'personal',
      name: 'personal',
      icon: <UserCheck color={'violet'} size={18} />,
    },
 
  ];
  const attributeUser = [
    {
      id: 'report',
      name: 'report',
      icon: <Flag color={'red'} size={18} />,
    },
    {
      id: 'delete',
      name: 'delete_friend',
      icon: <UserX color={'yellow'} size={18} />,
    },
    {
      id: 'block',
      name: 'block',
      icon: <ShieldOff color={'green'} size={18} />,
    },
    
  ];
  return {
    ChoiceItems,
    CategoryPersonal,
    CategoryGroup,
    attributeMember,
    attributeUser
  };
};

export {MenuItems, MenuChat};
