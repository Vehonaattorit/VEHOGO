import React, {useContext, useState} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {View} from 'native-base'
import {UserContext} from '../contexts'
import {JoinCompany} from './JoinCompany'
import {CustomButton} from '../components/CustomButton'
import {CreateCompany} from './CreateCompany'

export const Company = () => {
  const {user} = useContext(UserContext)
  const [showBtns, setShowBtns] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  return (
    <SafeAreaView style={styles.view}>
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
        <JoinCompany setShowJoin={setShowJoin}/>
      ) : showBtns === false && showCreate === true ? (
        <CreateCompany setShowCreate={setShowCreate}/>
      ) : (
        console.log('No money no honey')
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#26aae2',
  },

  listView: {
    flex: 1,
  },

  button: {
    marginTop: 10,
  },
})
