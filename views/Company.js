import React, {useContext, useState, useEffect} from 'react'
import {SafeAreaView, StyleSheet, FlatList} from 'react-native'
import {Content, Card, CardItem, Text, Left, Right, Icon, Button} from 'native-base'
import {View} from 'native-base'
import {UserContext} from '../contexts'
import {JoinCompany} from './JoinCompany'
import {CustomButton} from '../components/CustomButton'
import {CreateCompany} from './CreateCompany'
import {getCompanyCities} from '../controllers/companyCitiesController'
import {CompanyCitiesListItem} from '../components/CompanyCitiesListItem'


export const Company = ({navigation}) => {
  const {user} = useContext(UserContext)
  const [showBtns, setShowBtns] = useState(true)
  const [showJoin, setShowJoin] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [companyCities, setCities] = useState([])
  const [cityFilter, setCityFilter] = useState('')

  const fetchCities = async () => {
    const result = await getCompanyCities()
    setCities(result)
  }
  useEffect(() => {
    fetchCities()
  }, [])

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
            <Text style={{alignSelf: 'center', margin: 5}}>or find your company by choosing the city </Text>
          </View>

          <View style={styles.companyCities}>

            <FlatList
              data={companyCities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) =>
                <CompanyCitiesListItem city={item} setShowJoin={setShowJoin} setShowBtns={setShowBtns} setCityFilter={setCityFilter} />
              }
            />
          </View>
        </>
      )}
      {showBtns === false && showJoin === true ? (
        <JoinCompany navigation={navigation} setShowJoin={setShowJoin} setShowBtns={setShowBtns} cityFilter={cityFilter} />
      ) : showBtns === false && showCreate === true ? (
        <CreateCompany setShowCreate={setShowCreate} setShowBtns={setShowBtns} navigation={navigation} />
      ) : (
        console.log('No money no honey')
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',

  },
  button: {
    marginTop: 10,
  },
  companyCities: {

  },
})
