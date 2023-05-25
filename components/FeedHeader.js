import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { textStyles } from '../helpers/styles';

const windowWidth = Dimensions.get('window').width;

const FeedHeader = ({ title }) => {

  return (
    <View style={{ paddingVertical: 20, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderTopWidth: 1, width: windowWidth }}>
      <Text style={textStyles.boldLabel}>{title}</Text>
    </View>
  );
};


export default FeedHeader;
