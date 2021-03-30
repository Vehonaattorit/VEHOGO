import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Input, Item, Icon, Content, Form} from 'native-base';
import {Button} from 'react-native-paper'
import {CustomButton} from '../components/CustomButton'
import {CompanyList} from '../components/CompanyList'
import {companyQuery} from '../controllers/companyController'
export const JoinCompany = ({navigation, setShowJoin, setShowBtns, cityFilter}) => {

  const [companyData, setCompanyData] = useState([])
  const [filteredCompanyData, setFilteredCompanyData] = useState([])
  const [filter, setFilter] = useState('')
  const getCompanies = async () => {

    const companies = await companyQuery('city', '==', cityFilter)
    setCompanyData(companies)
  }

  const getCompaniesWithFilter = async () => {
    const filteredData = companyData.filter(company => company.displayName.includes(filter))
    setFilteredCompanyData(filteredData)
  }

  useEffect(() => {
    getCompanies()
  }, [])
  return (
    <View style={styles.container}>
      <CustomButton
        style={styles.button}
        title="Cancel"
        onPress={() => {
          setShowJoin(false)
          setShowBtns(true)
        }}
      />
      <Form style={styles.input}>
        <Item>
          <Input placeholder="Search by name"
            value={filter}
            onChangeText={setFilter}
          />
          <Button onPress={getCompaniesWithFilter} >
              <Icon active name='search-outline' />
          </Button>
        </Item>
      </Form>

      <View style={styles.companyList}>
        {filteredCompanyData.length != 0 ? (
          <CompanyList navigation={navigation} companyData={filteredCompanyData} />
        ) : (
          <CompanyList navigation={navigation} companyData={companyData} />
        )}
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
  },
})
