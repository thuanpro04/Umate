import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
  } from 'react-native';
  import React, { useEffect, useRef, useState } from 'react';
  import { TextComponent } from '../Components';
  
  interface Props {
    name: string;
    img: string;
    isVisible: boolean;
    onClose?: () => void;
  }
  
  const UserInfoModal = (props: Props) => {
    const { name, img, isVisible, onClose } = props;
    const slideAnim = useRef(new Animated.Value(300)).current;
    const [visible, setVisible] = useState(isVisible);
  
    useEffect(() => {
      if (isVisible) {
        setVisible(true); // Thiết lập modal hiển thị
        Animated.timing(slideAnim, {
          toValue: 0, // Trượt vào màn hình (vị trí 0)
          duration: 300, // Thời gian trượt (300ms)
          useNativeDriver: true,
        }).start();
      } else {
        // Khi Modal ẩn, trượt trở lại
        Animated.timing(slideAnim, {
          toValue: 300, // Trượt ra khỏi màn hình
          duration: 600, // Thay đổi thời gian ở đây (600ms)
          useNativeDriver: true,
        }).start(() => {
          setVisible(false); // Đóng modal sau khi hoàn tất hoạt động trượt
        });
      }
    }, [isVisible]);
  
    // Hàm đóng modal với hiệu ứng
    const handleClose = () => {
      Animated.timing(slideAnim, {
        toValue: 300, // Trượt ra khỏi màn hình
        duration: 400, // Thay đổi thời gian ở đây (600ms)
        useNativeDriver: true,
      }).start(() => {
        setVisible(false); // Đóng modal sau khi hoàn tất hoạt động trượt
        if (onClose) onClose(); // Gọi hàm onClose bên ngoài nếu có
      });
    };
  
    return (
      <Modal visible={visible} animationType="none" transparent>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Image source={{ uri: img }} style={styles.userImage} />
              <TextComponent styles={styles.userName} label={name} />
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
  export default UserInfoModal;
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối phía sau modal
      justifyContent: 'flex-end', // Đặt modal ở dưới cùng
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '50%', // Chiều cao của modal (nửa màn hình)
      width: '100%',
      alignItems: 'center',
    },
    userImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    closeButton: {
      color: 'blue',
      fontSize: 16,
    },
  });
  