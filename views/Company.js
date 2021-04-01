import React, {useState} from 'react'
import {StyleSheet} from 'react-native'
import {
  Text,
  Icon,
  Button,
} from 'native-base'
import {View, Item, Input} from 'native-base'
import {JoinCompany} from './JoinCompany'
import {CustomButton} from '../components/CustomButton'
import {CreateCompany} from './CreateCompany'
import {companyQuery} from '../controllers/companyController'

export const Company = ({navigation}) => {
  const [showBtns, setShowBtns] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [companyCode, setCompanyCode] = useState('')
  const [companyData, setCompanyData] = useState([])
  const [error, setError] = useState(false)

  const getCompanies = async () => {
    const companies = await companyQuery('companyCode', '==', companyCode)

    if (companies.length === 0) {
      console.log('did not found companies with code')
      setError(true)
    } else {
      console.log('found companies with code')
      setCompanyData(companies)
      setShowJoin(true)
      setShowBtns(false)
      setError(false)
    }

  }

  return (
    <View style={styles.view}>
      {showBtns && (
        <>
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
            <Text style={{alignSelf: 'center', margin: 5}}>
              or if you are invited to company insert code
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Item>
              <Input
                placeholder="Company Invitation Code"
                value={companyCode}
                onChangeText={setCompanyCode}
                errorMessage={
                  companyCode.length < 1 &&
                  'Company name must be at least 1 character long'
                }
              />
              <Button onPress={() => {
                getCompanies()
              }
              }>
                <Icon active name='checkmark-circle-outline' />
              </Button>
            </Item>
            {error &&
              <Text style={styles.errorText}>Code is not valid</Text>
            }

          </View>

        </>
      )}
      {showBtns === false && showJoin === true ? (
        <JoinCompany
          navigation={navigation}
          setShowJoin={setShowJoin}
          setShowBtns={setShowBtns}
          companyData={companyData}
        />
      ) : (
        showBtns === false &&
        showCreate === true && (
          <CreateCompany
            setShowCreate={setShowCreate}
            setShowBtns={setShowBtns}
            navigation={navigation}
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    alignSelf:'center'
  }

})
