import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ButtonComponent from './ButtonComponent';
import {appColors} from '../../Theme/Colors/appColors';
import {Calendar, Timer1, TimerStart} from 'iconsax-react-native';
import {appInfo} from '../../Theme/appInfo';
import {DateTime} from '../Untils/DateTime';
import DatePicker from 'react-native-date-picker';
import { globalStyles } from '../../Styles/globalStyle';

interface Props {
  dateSelected: Date;
  type: 'date' | 'time';
  onSelect: (val: Date) => void;
  label?: string;
}
const DateTimePickerComponent = (props: Props) => {
  const {dateSelected, type, onSelect, label} = props;
  const [isShowDateTimePicker, setIsShowDateTimePicker] = useState(false);
  return (
    <View>
      <ButtonComponent
        onPress={() => setIsShowDateTimePicker(true)}
        label={`${
          type === 'time'
            ? DateTime.getTime(dateSelected)
            : DateTime.getDate(dateSelected)
        }`}
        styles={globalStyles.button}
        labelColor={appColors.blue}
        textStyle={{fontWeight: 'bold', flex: 1, textAlign: 'center'}}
        iconRight={
          type === 'time' ? (
            <Timer1 size={appInfo.sizeIconBold} color={appColors.grey} />
          ) : (
            <Calendar size={22} color={appColors.grey} />
          )
        }
      />
      <DatePicker
        mode={type}
        date={new Date()}
        modal
        open={isShowDateTimePicker}
        onConfirm={val => {
          setIsShowDateTimePicker(false);
          onSelect(val);
        }}
        onCancel={() => setIsShowDateTimePicker(false)}
      />
    </View>
  );
};

export default DateTimePickerComponent;

const styles = StyleSheet.create({});
