import React, {useEffect, useContext, useState} from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
} from 'react-native'

import {color} from '../constants/colors'

export const FullWidthButton = (props) => {
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  return (
    <View style={styles.gridItem}>
      <TouchableCmp style={{flex: 1}} onPress={props.onPress}>
        <View style={styles.container(props.direction)}>
          {props.children}
          <View style={styles.titleContainer(props.color)}>
            <Text style={styles.title} numberOfLines={2}>
              {props.title}
            </Text>
          </View>
        </View>
      </TouchableCmp>
    </View>
  )
}


const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    borderRadius: 10,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 20,
  },
  container: function (direction) {
    return {
      backgroundColor: color.lightBlue,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 10,
      padding: 15,
      alignItems: 'center',
      justifyContent: direction == 'row' ? 'space-around' : 'center',
      flexDirection: direction == 'row' ? 'row' : 'column',
    }
  },
  titleContainer: function(customColor) {return {
    width: '50%',
    backgroundColor: customColor != undefined ? customColor: color.malachiteGreen,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  }},
  title: {
    fontFamily: 'open-sans-semi-bold',
    fontSize: Dimensions.get('window').height * 0.03,
    color: color.lightBlack,
    textAlign: 'right',
  },
})
