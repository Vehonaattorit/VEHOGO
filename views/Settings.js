import React, {useState, useContext} from 'react'
import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native'
import CustomButtonIcon from '../components/CustomIconButton'
import Modal from 'react-native-modal'
import CustomSingleIconButton from '../components/CustomSingleIconButton'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'
import {workTripMultiQuery} from '../controllers/workTripController'
import {setupWorkTripDocs} from '../utils/utils'

export const Settings = () => {
  const {user} = useContext(UserContext)

  const [isComapnyVisible, setCompanyVisible] = useState(false)
  const [isTravelVisible, setTravelVisible] = useState(false)
  const [isUsernameVisible, setIsUsernameVisible] = useState(false)
  const [isAddressVisible, setAddressVisible] = useState(false)
  const [isWorkDaysVisible, setIsWorkDaysVisible] = useState(false)
  const [isWorkingHoursVisible, setIsWorkingHoursVisible] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)

  const [travelPreference, setTravelPreference] = useState(
    user.travelPreference
  )

  const toggleModal = (view) => {
    view == 'Company'
      ? setCompanyVisible(true)
      : view === 'Travel'
      ? setTravelVisible(!isTravelVisible)
      : view === 'Username'
      ? setIsUsernameVisible(!isUsernameVisible)
      : view === 'Address'
      ? setAddressVisible(!isAddressVisible)
      : view === 'Working Days'
      ? setIsWorkDaysVisible(!isWorkDaysVisible)
      : view === 'Working Hours'
      ? setIsWorkingHoursVisible(!isWorkingHoursVisible)
      : view === 'Delete'
      ? setIsDeleteVisible(!isDeleteVisible)
      : console.log('ERROR')
  }

  const changeTravelPreference = async (newTravPref) => {
    Alert.alert(
      'Change travel preference',
      `Would you like to change your travel preference to ${newTravPref}?`,
      [
        {text: 'No', style: 'default'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            user.travelPreference = newTravPref

            console.log('new user trav pref', user.travelPreference)

            setTravelPreference(newTravPref)

            toggleModal('Travel')

            if (user.travelPreference === 'driver') {
              const response = await workTripMultiQuery(user.company.id, [
                {
                  field: 'driverID',
                  condition: '==',
                  value: user.id,
                },
              ])

              if (typeof response !== 'undefined' && response.length === 0) {
                // the array is defined and has no elements
                setupWorkTripDocs(user)
              }
            }

            // if (newTravPref === 'driver' )

            // await updateUser(user)
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.poweredContainer}>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="account-balance"
            title="Modify Your Company"
            onPress={() => {
              toggleModal('Company')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="airline-seat-recline-extra"
            title="Modify Your Travel Preference"
            onPress={() => {
              toggleModal('Travel')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="person"
            title="Modify Your Username"
            onPress={() => {
              toggleModal('Username')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="home"
            title="Modify Your Home Address"
            onPress={() => {
              toggleModal('Address')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="work"
            title="Modify Your Working Days"
            onPress={() => {
              toggleModal('Working Days')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            iconOne="access-time"
            title="Modify Your Working Hours"
            onPress={() => {
              toggleModal('Working Hours')
            }}
          />
        </View>
        <View style={styles.btn}>
          <CustomSingleIconButton
            style={styles.deleteBtn}
            iconOne="delete"
            title="Delete Your Account"
            onPress={() => {
              toggleModal('Delete')
            }}
          />
        </View>
      </View>
      {/* company */}
      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isComapnyVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify your Company information</Text>
            <CustomButtonIcon
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
              }}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setCompanyVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setCompanyVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* travel modal */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isTravelVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify your travel information</Text>
            <CustomButtonIcon
              disabled={travelPreference === 'driver'}
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => changeTravelPreference('driver')}
            />

            <CustomButtonIcon
              disabled={travelPreference === 'passenger'}
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => changeTravelPreference('passenger')}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setTravelVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setTravelVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Your Username */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isUsernameVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify Your Username</Text>
            <CustomButtonIcon
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
              }}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsUsernameVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsUsernameVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Your address */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isAddressVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify Your Home Address</Text>
            <CustomButtonIcon
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
              }}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setAddressVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setAddressVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Your Working Days */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isWorkDaysVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify Your Working Days</Text>
            <CustomButtonIcon
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
              }}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsWorkDaysVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsWorkDaysVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Your Working Hours */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isWorkingHoursVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>Modify Your Working Hours</Text>
            <CustomButtonIcon
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setTravelPreference('passenger')
              }}
            />

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsWorkingHoursVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsWorkingHoursVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete your account */}

      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
        isVisible={isDeleteVisible}
      >
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>
              Are You Sure You Want To Delete Your Account?
            </Text>

            <View style={styles.btns}>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteVisible(false)
                  }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.poweredBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setIsDeleteVisible(false)
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  poweredContainer: {
    margin: 5,
  },
  btn: {
    marginTop: 10,
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '90%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btns: {
    paddingTop: 20,
    paddingBottom: 20,

    flexDirection: 'row',
  },
  poweredBtns: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    margin: 20,
  },
})
