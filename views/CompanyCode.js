import React from 'react'
import {StyleSheet, Alert} from 'react-native'
import {Card, CardItem, Text} from 'native-base'
import {View} from 'native-base'
import Clipboard from 'expo-clipboard'
import CustomButtonIcon from '../components/CustomIconButton'
import {color} from '../constants/colors'

export const CompanyCode = ({navigation, companyCode, value}) => {
  console.log(value)
  return (
    <View style={styles.view}>

      <View style={styles.codeInfo}>
        <Text style={{alignSelf: 'center', fontFamily: 'open-sans-regular', fontSize: 30}}>{companyCode}</Text>
        <Text style={{paddingBottom: 10, textAlign: 'auto', fontFamily: 'open-sans-regular', marginTop: 10}}>
          This is your company joining code. Copy this code by pressing the "Copy to clipboard" button and share
          it to people who you want to have access to your company routes.
        </Text>
        {value == 'both' &&
        <Text style={{paddingBottom: 10, textAlign: 'auto', fontFamily: 'open-sans-regular', marginTop: 10}}>
          You accepted domain joining. Users with similar email domain can now find your company and join it.
        </Text>
        }

      </View>

      <View style={styles.btns}>
        <CustomButtonIcon
          onPress={() => {
            Clipboard.setString(companyCode)
            Alert.alert(
              'Code copied',
              'Now you can share code to other people'
            )
          }}
          iconOne="content-copy"
          title="Copy to clipboard"
        />
      </View>
      <View View style={styles.btns}>
        <CustomButtonIcon
          onPress={() => {
            navigation.navigate('Travel')
          }}
          title="Continue"
          iconTwo="keyboard-arrow-right"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textContainer: {
    height: '30%',
    width: '70%',
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
    color: '#EAEAEA',
  },
  title: {
    margin: 40,
    fontSize: 30,
    fontFamily: 'open-sans-regular',
  },
  btns: {
    marginTop: 10,
    width: '100%',
  },
  codeInfo: {
    margin: 10,
    backgroundColor: '#E1F5FD',
    padding: 10,
    borderRadius: 10
  }
})
