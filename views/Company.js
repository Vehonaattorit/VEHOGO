import React, {useContext, useState} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {View} from 'native-base'
import {UserContext} from '../contexts'
import {JoinCompany} from './JoinCompany'
import {CustomButton} from '../components/CustomButton'
import {CreateCompany} from './CreateCompany'

export const Company = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [showBtns, setShowBtns] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <View style={styles.view}>
      {showBtns && (
        <View style={styles.btnContainer}>
          <View style={styles.btn}>
            <CustomButton
              title="Create A Company"
              onPress={() => {
                setShowCreate(true)
                setShowBtns(false)
              }}
            />
          </View>

          <View style={styles.btn}>
            <CustomButton
              title="Join A Company"
              onPress={() => {
                setShowJoin(true)
                setShowBtns(false)
              }}
            />
          </View>
        </View>
      )}
      {showBtns === false && showJoin === true ? (
        <JoinCompany navigation={navigation} setShowJoin={setShowJoin} setShowBtns={setShowBtns}/>
      ) : showBtns === false && showCreate === true ? (
        <CreateCompany setShowCreate={setShowCreate} setShowBtns={setShowBtns} navigation={navigation}/>
      ) : (
        console.log('No money no honey')
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },

  button: {
    marginTop: 10,
  },
})
