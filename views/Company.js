import React, {useState} from 'react'
import {StyleSheet, KeyboardAvoidingView} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View, Item, Input} from 'native-base'
import {JoinCompany} from './JoinCompany'
import {CreateCompany} from './CreateCompany'
import {companyQuery} from '../controllers/companyController'
import CustomIconButton from '../components/CustomIconButton'
import {FontAwesome} from '@expo/vector-icons'

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
      setError(true)
    } else {
      setCompanyData(companies)
      setShowJoin(true)
      setShowBtns(false)
      setError(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.view}>
      {showBtns && (
        <>
          <View style={styles.poweredContainer}>
            <FontAwesome name="check-circle-o" size={300} color="#26AAE2" />

            <View style={styles.btnContainer}>
              <CustomIconButton
                onPress={() => {
                  setShowCreate(true)
                  setShowBtns(false)
                }}
                title="Create A Company"
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
                    getCompanies()
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
            {error && <Text style={styles.errorText}>Code is not valid</Text>}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
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
    marginTop: 120,
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
