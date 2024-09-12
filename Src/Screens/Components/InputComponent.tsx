import {
  View,
  Text,
  KeyboardType,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import RowComponent from './RowComponent';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { appColors } from '../../Theme/Colors/appColors';
interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placehold?: string;
  subffix?: ReactNode;
  isPass?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  styles?: StyleProp<ViewStyle>;
}
const InputComponent = (props: Props) => {
  const {
    value,
    affix,
    subffix,
    allowClear,
    multiline,
    numberOfLines,
    onChange,
    onEnd,
    type,
    styles,
    placehold,
    isPass,
  } = props;
  const [isShowPass, setIsShowPass] = useState(isPass ?? false);

  return (
    <View style={{backgroundColor: appColors.grey}}>
      <RowComponent
        styles={{alignItems: 'center', paddingHorizontal: 12, gap: 10}}>
        {affix && affix}
        <TextInput
          placeholder={placehold}
          value={value}
          onEndEditing={onEnd}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={isShowPass}
          onChangeText={(element): any => onChange(element)}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          maxLength={numberOfLines ? 280 : 150}
          style={{flex: 1}}
        />
        {subffix && subffix}

        <TouchableOpacity
          onPress={
            isPass ? () => setIsShowPass(!isShowPass) : () => onChange('')
          }>
          {isPass ? (
            <Feather
              name={isShowPass ? 'eye-off' : 'eye'}
              color={appColors.white}
              size={22}
            />
          ) : (
            value &&
            value.length > 0 &&
            props.allowClear && (
              <AntDesign name="close" size={22} color={appColors.white} />
            )
          )}
        </TouchableOpacity>
      </RowComponent>
    </View>
  );
};

export default InputComponent;
