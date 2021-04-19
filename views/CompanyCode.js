import React from 'react'
import {StyleSheet} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View} from 'native-base'
import Clipboard from 'expo-clipboard'
import CustomButtonIcon from '../components/CustomIconButton'

export const CompanyCode = ({navigation, companyCode}) => {
  return (
    <View style={styles.view}>
      <Text style={styles.title}>{companyCode}</Text>
      <Text style={{margin: 5}}>
        Share this code with members of your company
      </Text>
      <CustomButtonIcon
        style={{alignSelf: 'center'}}
        onPress={Clipboard.setString(companyCode)}
        iconOne="copy-outline"
        title="Copy to clipboard"
      />
      <CustomButtonIcon
        style={{alignSelf: 'center', margin: 5}}
        onPress={() => {
          navigation.navigate('Travel')
        }}
        title="Continue"
        iconTwo="keyboard-arrow-right"
      />
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
  button: {
    marginTop: 10,
  },

  title: {
    fontSize: 30,
    margin: 10,
  },
})
