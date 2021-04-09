import React, {useState} from 'react'
import {StyleSheet} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import {View, Item, Input} from 'native-base'
import {JoinCompany} from './JoinCompany'
import {CreateCompany} from './CreateCompany'
import {companyQuery} from '../controllers/companyController'
import CustomIconButton from '../components/CustomIconButton'

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
        <View>
          <View style={styles.poweredContainer}>
            <View style={styles.btnContainer}>
              <CustomIconButton
                onPress={() => {
                  setShowCreate(true)
                  setShowBtns(false)
                }}
                title="Create A Company"
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
        </View>
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
  poweredContainer: {
    marginTop: 500,
  },

  btnContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1F5FD',
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 5,
    padding: 10,
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
