import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {RowComponent, SpaceComponent, TextComponent} from '../../Components';
import FastImage from 'react-native-fast-image';
import {UserInfo} from '../../Untils/UserInfo';
import {appColors} from '../../../Theme/Colors/appColors';

const RenderComment = ({item, index, colors, handleReply}: any) => {
  const [isShowContent, setIsShowContent] = useState<{[key: string]: boolean}>(
    {},
  );
  const [shouldShowMore, setShouldShowMore] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleShowContent = (id: string) => {
    setIsShowContent(prev => ({...prev, [id]: !prev[id]}));
  };
  const handleTextLayout = (e: any, id: string) => {
    const {lines} = e.nativeEvent;
    if (lines.length > 4) {
      setShouldShowMore(prev => ({...prev, [id]: true}));
    }
  };
  const getComment = (comment: string) => {
    if (comment) {
      if (comment.charAt(0) === '@') {
        const str = comment.split(' ');
        console.log(str);
      }
    }
  };
  const renderComment = (comment: any, id: string, isBorder?: Boolean) => {
    return (
      <View style={{flex: 1}} key={id}>
        {isBorder && (
          <View
            style={{
              width: '50%',
              borderWidth: 0.2,
              alignSelf: 'center',
              marginVertical: 6,
              borderColor: '#D3d3d3',
            }}
          />
        )}
        <RowComponent styles={{justifyContent: 'flex-start'}}>
          <FastImage
            source={{uri: comment.avatar}}
            style={{height: 35, width: 35, borderRadius: 50}}
          />
          <TextComponent label={comment.name} />
        </RowComponent>
        <SpaceComponent height={6} />

        <View
          style={{
            backgroundColor: '#eeeeee',
            borderRadius: 12,
            paddingVertical: 6,
          }}>
          <TextComponent
            label={comment.comment}
            styles={{marginLeft: 12}}
            handleTextLayout={e => handleTextLayout(e, comment.commentId)}
            numberOfLine={isShowContent[comment.commentId] ? undefined : 4}
          />
          {shouldShowMore[comment.commentId] && (
            <TouchableOpacity
              onPress={() => toggleShowContent(comment.commentId)}
              style={{marginRight: 12}}>
              <TextComponent
                label={isShowContent[comment.commentId] ? 'Ẩn đi' : 'Xem thêm'}
                color={colors.text2}
                size={12}
                styles={{textAlign: 'right'}}
              />
            </TouchableOpacity>
          )}
        </View>
        <SpaceComponent height={8} />
        <RowComponent styles={{justifyContent: 'flex-start'}}>
          <TextComponent
            label={`${UserInfo.getTime(comment.timestamp)}`}
            styles={{textAlign: 'left', flex: 1, marginLeft: 6}}
            size={14}
            color={colors.text2}
          />
          <TouchableOpacity
            style={{paddingRight: 6}}
            onPress={() => handleReply(comment)}>
            <TextComponent
              label="Trả lời"
              styles={{textAlign: 'right'}}
              size={14}
              color={appColors.blue}
            />
          </TouchableOpacity>
        </RowComponent>
      </View>
    );
  };

  return (
    <View
      key={item.commentId}
      style={{
        flex: 1,
        borderWidth: 0.1,
        borderRadius: 4,
        marginBottom: 18,
        padding: 6,
      }}>
      {renderComment(item, item.commentId)}
      <SpaceComponent height={6} />
      {item.replies?.length > 0 && (
        <View style={{marginLeft: 28}}>
          {item.replies.map((e: any) => renderComment(e, e.commentRepId, true))}
        </View>
      )}
    </View>
  );
};

export default RenderComment;

const styles = StyleSheet.create({});
