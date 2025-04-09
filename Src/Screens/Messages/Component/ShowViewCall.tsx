import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import {CallIncoming} from 'iconsax-react-native';
import CustomCallButtonComponent from './CustomCallButtonComponent';
import {appColors} from '../../../Theme/Colors/appColors';
interface Props {
  content: string;
  color: string;
  reply: string;
  iColor: string;
  conversationInfo: any;
  name: string;
  isBlock: boolean;
  condition: any;
  userId: string;
}
const ShowViewCall = (props: Props) => {
  const {
    content,
    color,
    reply,
    iColor,
    conversationInfo,
    condition,
    name,
    isBlock,
    userId,
  } = props;
  return (
    <View>
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <TextComponent
          label={content}
          color={color}
          styles={[
            styles.contentStyles,
            {marginHorizontal: reply ? 15 : 0, fontSize: 16},
          ]}
          title
        />
        <RowComponent>
          <CallIncoming size={12} color={iColor} />
          <TextComponent
            label={'Cuộc gọi thoại'}
            color={color}
            styles={[styles.contentStyles, {marginHorizontal: reply ? 15 : 0}]}
            size={12}
          />
        </RowComponent>
      </View>
      <SpaceComponent height={5} />
      <SpaceComponent
        bgCrossBar="grey"
        width={'100%'}
        isCrossBar
        height={0.5}
      />
      <SpaceComponent height={5} />
      <CustomCallButtonComponent
        converInfo={conversationInfo}
        isDisible={isBlock}
        type={condition}
        styles={{justifyContent: 'center', alignItems: 'center'}}
        targetName={
          conversationInfo.type === 'personal'
            ? name
            : conversationInfo.groupName
        }
        targetId={
          conversationInfo.type === 'personal'
            ? conversationInfo.userId
            : conversationInfo.invitedUsers?.filter(
                (id: any) => id !== userId,
              )
        }
        text="Gọi lại"
        txtStyles={{color: appColors.blue, fontSize: 18}}
      />
    </View>
  );
};

export default ShowViewCall;
const styles = StyleSheet.create({
  contentStyles: {
    fontSize: 14,

    paddingTop: 4,
  },
});
