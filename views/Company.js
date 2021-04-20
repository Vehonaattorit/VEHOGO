import React, {useState, useEffect} from 'react'
import {StyleSheet, KeyboardAvoidingView} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View, Item, Input} from 'native-base'
import {JoinCompany} from './JoinCompany'
import {CreateCompany} from './CreateCompany'
import {companyQuery, companyMultiQuery} from '../controllers/companyController'
import CustomIconButton from '../components/CustomIconButton'
import {FontAwesome} from '@expo/vector-icons'
import firebase from '../firebase/fire'

export const Company = ({navigation}) => {
  const [showBtns, setShowBtns] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [companyCode, setCompanyCode] = useState('')
  const [companyData, setCompanyData] = useState([])
  const [error, setError] = useState(false)
  const [domain, setDomain] = useState('')

  useEffect(() => {
    getDomain()
  }, [])

  const getDomain = () => {
    const userEmail = firebase.auth().currentUser.email
    const domainString = userEmail.split('@').pop()
    setDomain(domainString)
  }

  const getCompanies = async (useDomain) => {
    let companies
    if (useDomain) {
      companies = await companyMultiQuery([
        {field: 'domainJoin', condition: '==', value: true},
        {field: 'domain', condition: '==', value: domain},
      ])

      //companies = await companyMultiQuery('companyCode', '==', companyCode)
    } else {
      companies = await companyQuery('companyCode', '==', companyCode)
    }

    if (companies.length === 0) {
      setError(true)
    } else {
      setCompanyData(companies)
      setShowJoin(true)
      setShowBtns(false)
      setError(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      {showBtns && (
        <>
          <View style={styles.poweredContainer}>
            <View style={styles.icon}>
              <FontAwesome name="check-circle-o" size={300} color="#26AAE2" />
            </View>
            <View style={styles.btnContainer}>
              <CustomIconButton
                onPress={() => {
                  setShowCreate(true)
                  setShowBtns(false)
                }}
                title="Create A Company"
                iconTwo="keyboard-arrow-right"
              />
              <Text style={{alignSelf: 'center'}}>
                Or Join with either email domain or company code{' '}
              </Text>
              <CustomIconButton
                style={{marginBottom: 5}}
                onPress={() => {
                  getCompanies(true)
                }}
                title="Use your email domain"
                iconTwo="keyboard-arrow-right"
              />
            </View>
            <Item style={styles.inputContainer}>
              <Input
                backgroundColor="white"
                placeholder="Company Invitation Code"
                value={companyCode}
                style={{borderRadius: 5}}
                onChangeText={setCompanyCode}
                errorMessage={
                  companyCode.length < 1 &&
                  'Company name must be at least 1 character long'
                }
              />
              <View style={styles.companyCodeBtnContainer}>
                <Button
                  onPress={() => {
                    getCompanies(false)
                  }}
                  backgroundColor="#69CBE8"
                  borderRadius={5}
                >
                  <Icon
                    active
                    name="checkmark-circle-outline"
                    backgroundColor="black"
                  />
                </Button>
              </View>
            </Item>
            {error && (
              <Text style={styles.errorText}>Code or domain is not valid</Text>
            )}
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
            domain={domain}
          />
        )
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  poweredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'stretch',
  },

  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1F5FD',
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 5,
    padding: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: {width: 1, height: 13},
  },

  companyCodeBtnContainer: {
    borderRadius: 5,
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
  },
})
