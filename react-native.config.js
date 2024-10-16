module.exports = {
  project: {
    android: {
      packageName: 'com.umate', // Đảm bảo đúng với cấu hình Android
    },
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  assets: ['../UMate/assets/fonts/'],
};
