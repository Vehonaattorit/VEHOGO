import React from 'react'
import {StyleSheet} from 'react-native'
import {Card, Text} from 'native-base'
import {View} from 'native-base'
import Clipboard from 'expo-clipboard'
import CustomButtonIcon from '../components/CustomIconButton'
import {color} from '../constants/colors'

export const CompanyCode = ({navigation, companyCode}) => {
  return (
    <View style={styles.view}>
      <Card style={styles.textContainer}>
        <Text style={styles.title}>{companyCode}</Text>
        <Text style={{paddingBottom: 40, textAlign: 'auto',fontFamily: 'open-sans-regular'}}>
          Please copy this code by pressing the "Copy to clipboard button" your
          team members will be needing it to join your company.
        </Text>
      </Card>
      <View style={styles.btns}>
        <CustomButtonIcon
          onPress={Clipboard.setString(companyCode)}
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
})
