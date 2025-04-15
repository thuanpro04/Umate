import React, {useState} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Anchor, Globe, Users, Lock} from 'lucide-react-native';
import {SpaceComponent, TextComponent} from '../../Components';
import {appColors} from '../../../Theme/Colors/appColors';

const PrivacySelector = ({visible, onClose, onSelect, currentPrivacy}: any) => {
  const options = [
    {
      id: 'public',
      label: 'Công khai',
      icon: Globe,
      description: 'Mọi người đều có thể thấy',
    },
    {
      id: 'friends',
      label: 'Bạn bè',
      icon: Users,
      description: 'Chỉ bạn bè có thể thấy',
    },
    {
      id: 'private',
      label: 'Chỉ mình tôi',
      icon: Lock,
      description: 'Chỉ bạn có thể thấy',
    },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TextComponent
              label="Ai có thể xem bài viết này?"
              styles={styles.headerText}
            />
          </View>

          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                currentPrivacy === option.id && styles.selectedOption,
              ]}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}>
              <View style={styles.optionContent}>
                <option.icon
                  size={24}
                  color={currentPrivacy === option.id ? appColors.blue : '#666'}
                />
                <SpaceComponent width={12} />
                <View>
                  <TextComponent
                    label={option.label}
                    styles={
                      currentPrivacy === option.id ? styles.selectedText : null
                    }
                  />
                  <TextComponent
                    label={option.description}
                    styles={styles.descriptionText}
                  />
                </View>
              </View>

              {currentPrivacy === option.id && (
                <View style={styles.checkmark}>
                  <TextComponent label="✓" styles={styles.checkmarkText} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default PrivacySelector;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#f0f0ff',
  },
  selectedText: {
    color: appColors.blue,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: appColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  menuItem: {
    // giữ nguyên style của bạn
  },
});
