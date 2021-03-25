import React from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Button, Input, Card} from 'react-native-elements'
import {CustomButton} from '../components/CustomButton'
import {CustomTitle} from '../components/CustomTitle'
import {AntDesign, FontAwesome} from '@expo/vector-icons'
export const Address = ({navigation}) => {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomTitle title="Address" />
      <View style={styles.icon}>
        {Platform.OS === 'ios' ? (
          <AntDesign name="home" size={300} color={color.secondaryDark} />
        ) : (
          <FontAwesome name="home" size={300} color={color.secondaryDark} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Address"
          style={styles}
          secureTextEntry={true}
          //onChangeText={(value) => this.setState({comment: value})}
        />

        <Input
          placeholder="City"
          style={styles}
          secureTextEntry={true}
          //onChangeText={(value) => this.setState({comment: value})}
        />

        <CustomButton
          style={styles.btns}
          title="Submit"
          onPress={() => {
            navigation.navigate('WorkingDays')
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 60,
    width: '90%',
    color: 'white',
  },
  icon: {
    marginBottom: 100,
  },
})
