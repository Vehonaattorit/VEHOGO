import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Button} from 'react-native-paper'
import {CustomButton} from '../components/CustomButton'
import {CompanyList} from '../components/CompanyList'
import {getCompanys} from '../controllers/companyController'

export const JoinCompany = ({navigation, setShowJoin, setShowBtns}) => {

  const [companyData, setCompanyData] = useState([])

  const getCompanies = async () => {

    const companies = await getCompanys()
    console.log('companies: '+companies)
    setCompanyData(companies)
  }

  useEffect(() => {
    getCompanies()
  }, [])
  return (
    <View style={styles.container}>
      <CompanyList navigation={navigation} companyData={companyData} style={styles.companyList}/>
      <CustomButton
        style={styles.button}
        title="Cancel"
        onPress={() => {
          setShowJoin(false)
          setShowBtns(true)
        }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1
  },
  companyList: {
    flex: 3
  }
})
