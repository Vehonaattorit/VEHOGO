import React, {useState} from 'react'
import {StyleSheet} from 'react-native'
import {Text, Icon, Button, Card} from 'native-base'
import {View, Item, Input} from 'native-base'
import {JoinCompany} from './JoinCompany'
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
        <Card style={styles.container}>
          <>
            <View style={styles.btnContainer}>
              <View style={styles.btn}>
                <Button
                  style={styles.createCompanyBtn}
                  onPress={() => {
                    setShowCreate(true)
                    setShowBtns(false)
                  }}
                >
                  <Text style={styles.btnText}>Create A Company</Text>
                </Button>
              </View>
              <Text style={{alignSelf: 'center', margin: 10, color: '#fff'}}>
                If you are member of the company insert code
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Item style={styles.input}>
                <Input
                  placeholder="Company Invitation Code"
                  value={companyCode}
                  onChangeText={setCompanyCode}
                  errorMessage={
                    companyCode.length < 1 &&
                    'Company name must be at least 1 character long'
                  }
                />
                <Button
                  style={styles.companyCodeBtn}
                  onPress={() => {
                    getCompanies()
                  }}
                >
                  <Icon
                    active
                    name="checkmark-circle-outline"
                    style={styles.btnText}
                  />
                </Button>
              </Item>
              {error && <Text style={styles.errorText}>Code is not valid</Text>}
            </View>
          </>
        </Card>
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
  container: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  createCompanyBtn: {
    alignSelf: 'stretch',
    borderRadius: 100,
    backgroundColor: '#26AAE2',
    justifyContent: 'center',
  },
  btnText: {
    color: '#000',
  },
  button: {
    marginTop: 10,
  },
  companyCodeBtn: {
    borderRadius: 25,
    marginTop: 3,
    marginRight: 5,
    backgroundColor: '#4FD966',
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    margin: 5,
  },
})
