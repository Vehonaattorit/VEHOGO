import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Input, Item, Icon, Content, Form} from 'native-base'
import {Button} from 'react-native-paper'
import {CustomButton} from '../components/CustomButton'
import {CompanyList} from '../components/CompanyList'
import {companyQuery} from '../controllers/companyController'
import CustomButtonIcon from '../components/CustomIconButton'
export const JoinCompany = ({
  navigation,
  setShowJoin,
  setShowBtns,
  companyData,
}) => {

  useEffect(() => {
    navigation.setOptions({
      title: 'Join Company',
    })
  }, [])

  return (
    <View style={styles.container}>
      <CustomButtonIcon
        style={styles.button}
        title="Cancel"
        onPress={() => {
          setShowJoin(false)
          setShowBtns(true)
        }}
        iconOne="keyboard-arrow-left"
      />

      <View style={styles.companyList}>
        <CompanyList navigation={navigation} companyData={companyData} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    marginTop: 5,
  },
  companyList: {
    flex: 6,
  },
})
