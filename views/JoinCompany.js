import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Input, Item, Icon, Content, Form} from 'native-base';
import {Button} from 'react-native-paper'
import {CustomButton} from '../components/CustomButton'
import {CompanyList} from '../components/CompanyList'
import {getCompanys, companyQuery} from '../controllers/companyController'

export const JoinCompany = ({navigation, setShowJoin, setShowBtns}) => {

  const [companyData, setCompanyData] = useState([])
  const [filter, setFilter] = useState('')

  const getCompanies = async () => {

    const companies = await getCompanys()
    console.log('companies: ' + companies)
    setCompanyData(companies)
  }

  const getCompaniesWithFilter = async () => {
    console.log('filter: '+filter)
    if (filter != '') {
      const companies = await companyQuery('displayName', '==', filter)
      console.log('companies: ' + companies)
      setCompanyData(companies)
    } else {
      const companies = await getCompanys()
      console.log('companies: ' + companies)
      setCompanyData(companies)
    }
  }

  useEffect(() => {
    getCompanies()
  }, [])
  return (
    <View style={styles.container}>
      <Form style={styles.input}>
        <Item>

          <Input placeholder="Search"
            value={filter}
            onChangeText={setFilter}
          />
          <Button onPress={() => {getCompaniesWithFilter()}} ><Icon active name='search-outline' /></Button>
        </Item>
      </Form>
      <CustomButton
        style={styles.button}
        title="Cancel"
        onPress={() => {
          setShowJoin(false)
          setShowBtns(true)
        }}
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
  },
  button: {
    flex: 1
  },
  companyList: {
    flex: 6,
  },
  input: {
    flex: 0.5,
  },
})
