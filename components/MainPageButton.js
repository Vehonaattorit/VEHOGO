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

import {UserContext} from '../contexts'
import {color} from '../constants/colors'

const MainPageButton = (props) => {
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }

  return (
    <View style={styles.gridItem}>
      <TouchableCmp style={{flex: 1}} onPress={props.onPress}>
        <View style={{...styles.container, ...{backgroundColor: props.color}}}>
          {props.children}
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              height: 40,
              paddingHorizontal: 10,
              borderRadius: 10,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.title} numberOfLines={2}>
              {props.title}
            </Text>
          </View>
        </View>
      </TouchableCmp>
    </View>
  )
}

export default MainPageButton

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    height: 100,
    borderRadius: 10,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 22,
    color: 'black',
    textAlign: 'right',
  },
})
