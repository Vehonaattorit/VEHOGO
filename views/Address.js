import React from 'react'
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native'
import {color} from '../constants/colors'
import {Button, Input, Card} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import {CustomButton} from '../components/CustomButton'
export const Address = ({navigation}) => {
  return (
    <KeyboardAvoidingView  behavior="padding" style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Address"
          leftIcon={<Icon name="" size={24} color={color.grey} />}
          style={styles}
          secureTextEntry={true}
          onChangeText={(value) => this.setState({comment: value})}
        />

        <Input
          placeholder="City"
          leftIcon={<Icon name="" size={24} color={color.grey} />}
          style={styles}
          secureTextEntry={true}
          onChangeText={(value) => this.setState({comment: value})}
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
})
