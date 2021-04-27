import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import {googleMapsApiKey} from '../secrets/secrets'
import CustomButtonIcon from '../components/CustomIconButton'
import Modal from 'react-native-modal'
import CustomSingleIconButton from '../components/CustomSingleIconButton'
import CustomSimpleInput from '../components/CustomSimpleInput'
import CustomCompanyInput from '../components/CustomCompanyInput'
import {Item} from 'native-base'
import GooglePlacesInput from '../components/GooglePlaceInput'
import {UserContext} from '../contexts'
import {updateUser} from '../controllers/userController'
import {deleteUser} from '../controllers/userController'
import {RoundButton} from '../components/RoundButton'
import {color} from '../constants/colors'
import DateTimePicker from '@react-native-community/datetimepicker'
import firebase from 'firebase'
import {formatTime} from '../utils/utils'
import {workTripMultiQuery} from '../controllers/workTripController'
import {setupWorkTripDocs} from '../utils/utils'
import {signOut} from '../controllers/LoginController'
import {updateCompanyCity} from '../controllers/companyCitiesController'
import {updateCompany} from '../controllers/companyController'
import {Company} from '../models/company'
//--------------------WORKING HOURS-----------------------

const DateTimeInput = (props) => {
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios')
  useEffect(() => {
    props.onChange('', new Date())
  }, [])

  return (
    <View style={Platform.OS === 'android' ? styles.dateTime : null}>
      {showTimePicker && (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          mode="time"
          value={props.value || new Date()}
          onChange={(e, date) => {
            setShowTimePicker(Platform.OS === 'ios')
            if (date) props.onChange(e, date)
          }}
        />
      )}
    </View>
  )
}

const TimeModal = ({
  setIsPickerShow,
  isPickerShow,
  modalVisible,
  handleModal,
  onChange,
  value,
}) => {
  if (Platform.OS === 'android') {
    return (
      <>
        {isPickerShow && (
          <DateTimePicker
            mode="time"
            is24Hour={true}
            onChange={(e, date) => {
              setIsPickerShow(false)
              if (date) onChange(e, date)
            }}
            value={value || new Date()}
          />
        )}
      </>
    )
  }

  return (
    <Modal
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{color: color.primary}}>Select time</Text>

          <DateTimeInput onChange={onChange} value={value} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleModal(!modalVisible)
              }}
            >
              <Text style={{color: color.secondary}}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleModal(!modalVisible)
              }}
            >
              <Text style={{color: color.secondary}}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

//--------------------------USERNAME----------------------------
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }
    let updatedFormIsValid = true
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
  }
  return state
}

export const Settings = () => {
  const {user} = useContext(UserContext)

  // useState for modals
  const [isComapnyVisible, setCompanyVisible] = useState(false)
  const [isTravelVisible, setIsTravelVisible] = useState(false)
  const [isUsernameVisible, setIsUsernameVisible] = useState(false)
  const [isAddressVisible, setIsAddressVisible] = useState(false)
  const [isWorkDaysVisible, setIsWorkDaysVisible] = useState(false)
  const [isWorkingHoursVisible, setIsWorkHoursVisible] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)

  const toggleModal = (view) => {
    view == 'Company'
      ? setCompanyVisible(true)
      : view === 'Travel'
      ? setIsTravelVisible(!isTravelVisible)
      : view === 'Username'
      ? setIsUsernameVisible(!isUsernameVisible)
      : view === 'Address'
      ? setIsAddressVisible(!isAddressVisible)
      : view === 'Working Days'
      ? setIsWorkDaysVisible(!isWorkDaysVisible)
      : view === 'Working Hours'
      ? setIsWorkHoursVisible(!isWorkingHoursVisible)
      : view === 'Delete'
      ? setIsDeleteVisible(!isDeleteVisible)
      : console.log('ERROR: views/Settings.js/toggleModel')
  }

  //-------------------COMPANY----------------------
  const [companyAddress, setAddress] = useState('')
  const [companyName, setName] = useState('')
  const [companyCode, setCompanyCode] = useState('')
  const [random, setRandom] = useState('')

  useEffect(() => {
    setRandom(getRandomString(4))
  }, [])

  function getRandomString(length) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var result = ''
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      )
    }
    return result
  }
  const setCompanyName = (companyName) => {
    setName(companyName)
    setCompanyCode(companyName.replace(/\s+/g, '') + '-' + random)
  }

  const getCompanyGeoLocation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${companyAddress}&language=fi&key=${googleMapsApiKey}`,
        {
          method: 'GET',
          //Request Type
        }
      )
      const responseJson = await response.json()

      const locationPoint = new firebase.firestore.GeoPoint(
        responseJson.results[0].geometry.location.lat,
        responseJson.results[0].geometry.location.lng
      )

      var city = ''
      var route = ''
      var streetNumber = ''
      var postalCode = ''
      responseJson.results[0].address_components.forEach((element) => {
        if (element.types[0] === 'locality') {
          city = element.long_name
        }
        if (element.types[0] === 'route') {
          route = element.long_name
        }
        if (element.types[0] === 'street_number') {
          streetNumber = element.long_name
        }
        if (element.types[0] === 'postal_code') {
          postalCode = element.long_name
        }
      })

      const address = route + ' ' + streetNumber
      const data = {
        point: locationPoint,
        city: city,
        address: address,
        postalCode: postalCode,
      }

      return data
    } catch (e) {
      console.error(e)
    }
  }
  const sendCompanyData = async () => {
    if (companyAddress.length > 0 && companyName.length > 0) {
      const data = await getCompanyGeoLocation()

      console.log('Company name', companyName)
      console.log('Company code', companyCode)
      console.log('Company address', companyAddress)

      await updateCompanyCity(data.city)

      user.com

      const companyId = await updateCompany(
        new Company({
          address: data.address,
          displayName: companyName,
          userIDs: [user.id],
          location: data.point,
          city: data.city,
          companyCode: companyCode,
          postalCode: data.postalCode,
          // domain: domain,
          // domainJoin: false,
        })
      )

      const companyUserData = {
        address: data.address,
        name: companyName,
        location: data.point,
        id: companyId,
      }

      user.company = companyUserData
      await updateUser(user)
    } else {
    }
  }

  //------------------TRAVEL---------------------
  const [buttonPressed, setButtonPressed] = useState(false)
  const setTravelPreference = async (preference) => {
    user.travelPreference = preference
    await updateUser(user)
  }

  //-----------------USERNAME------------------
  const usernameSubmitHandler = () => {
    if (!formState.formIsValid && formState.inputValues.userName === '') {
      Alert.alert(
        'Wrong input!',
        'Please create a username that has at least 1 letter.',
        [{text: 'Okay'}]
      )
      return
    }

    const {userName} = formState.inputValues
    user.userName = userName
    updateUser(user)
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      userName: user.userName ? user.userName : '',
    },
    inputValidities: {
      userName: user.userName ? true : false,
    },
    formIsValid: user.userName ? true : false,
  })

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [dispatchFormState, user]
  )

  //--------------------HOME ADDRESS------------------

  const [hAddress, setHAddress] = useState(user.homeAddress || '')
  const homeAddressSubmitHandler = async () => {
    if (hAddress.trim().length <= 1) {
      Alert.alert(
        'Wrong input!',
        'Please write an address which has more than one letter.',
        [{text: 'Okay'}]
      )
      return
    }

    const data = await getHAddressGeoLocation()

    user.homeAddress = hAddress
    user.city = data.city
    user.homeLocation = data.point

    console.log('user.homeAddress', user.homeAddress)

    await updateUser(user)
  }

  const getHAddressGeoLocation = async () => {
    try {
      console.log(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${hAddress}&language=fi&key=${googleMapsApiKey}`
      )
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${hAddress}&language=fi&key=${googleMapsApiKey}`,
        {
          method: 'GET',
          //Request Type
        }
      )
      const responseJson = await response.json()
      const locationPoint = new firebase.firestore.GeoPoint(
        responseJson.results[0].geometry.location.lat,
        responseJson.results[0].geometry.location.lng
      )
      var city = ''
      responseJson.results[0].address_components.forEach((element) => {
        if (element.types[0] === 'locality') {
          city = element.long_name
        }
      })
      const data = {
        point: locationPoint,
        city: city,
      }
      return data
    } catch (e) {
      console.error(e)
    }
  }

  // ----------------WORKING DAYS-------------------------
  const workStates = [
    {id: 1, weekDay: 'Mon', isSelected: false},
    {id: 2, weekDay: 'Tue', isSelected: false},
    {id: 3, weekDay: 'Wed', isSelected: false},
    {id: 4, weekDay: 'Thu', isSelected: false},
    {id: 5, weekDay: 'Fri', isSelected: false},
    {id: 6, weekDay: 'Sat', isSelected: false},
    {id: 7, weekDay: 'Sun', isSelected: false},
  ]

  const [workDays, setWorkDays] = useState(
    user.preferedWorkingHours !== undefined
      ? workStates.map((item) => {
          return item.id == user.preferedWorkingHours[item.id - 1]
            ? {...item, isSelected: true}
            : item
        })
      : workStates
  )

  const [error, setError] = useState('')
  useEffect(() => {
    let workDayIds = []

    const {preferedWorkingHours} = user

    if (!preferedWorkingHours) return

    for (const workDay of workDays) {
      console.log('Every preferedWorkingHours item')
      for (const day of preferedWorkingHours) {
        console.log('Every workDayNum')

        if (workDay.id === day.workDayNum) {
          console.log('found a workday !!!')

          console.log('workDayNum', workDay)
          workDayIds.push(workDay.id)
        }
      }
    }

    let updatedWorkDays = workStates
    for (let i = 0; i < workDayIds.length; i++) {
      for (let j = 0; j < workDays.length; j++) {
        if (workDays[j].id === workDayIds[i]) {
          updatedWorkDays[j].isSelected = true
          console.log('IS TRUE', workDays[j])
        }
      }
    }
    setWorkDays(updatedWorkDays)
  }, [])

  const toggleHandler = (selectedItem, isSelected) => {
    const newArr = workDays.map((item) => {
      if (item.id == selectedItem.id) {
        return {
          ...item,
          isSelected,
        }
      } else {
        return item
      }
    })
    setWorkDays(newArr)
  }

  const submitHandler = async () => {
    const isValid = workDays.some((item) => item.isSelected === true)

    if (!isValid) {
      Alert.alert('Wrong input!', 'Please select at least one work day.', [
        {text: 'Okay'},
      ])
      setError('Please select at least one work day.')

      return
    }

    const preferedWorkDays = []
    workDays.forEach((element) => {
      if (element.isSelected) {
        preferedWorkDays.push({workDayNum: element.id})
      }
    })
    user.preferedWorkingHours = preferedWorkDays
    await updateUser(user)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  const changeTravelPreference = (newTravPref) => {
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
                // the workTrip is defined and has no elements
                setupWorkTripDocs(user)
              }
            }
            // if (newTravPref === 'driver' )
            await updateUser(user)
          },
        },
      ]
    )
  }

  //------------------WORKING HOURS---------------------

  // If starting and ending time was found in db, set fetched values instead of default
  const [newEventState, setNewEventState] = useState({
    startDate:
      user.preferedWorkingHours[0].workDayStart === undefined
        ? null
        : user.preferedWorkingHours[0].workDayStart.toDate()
        ? user.preferedWorkingHours[0].workDayStart.toDate()
        : user.preferedWorkingHours[0].workDayStart,
    endDate:
      user.preferedWorkingHours[0].workDayEnd === undefined
        ? null
        : user.preferedWorkingHours[0].workDayEnd.toDate()
        ? user.preferedWorkingHours[0].workDayEnd.toDate()
        : user.preferedWorkingHours[0].workDayEnd,
  })

  const updateValue = (newValue, fieldName) => {
    setIsPickerShow(false)
    setNewEventState({
      ...newEventState,
      [fieldName]: newValue,
    })
  }

  const [modalVisible, setModalVisible] = useState(false)
  const [timeError, setTimeError] = useState(false)

  const timeSubmitHandler = () => {
    const {startDate, endDate} = newEventState

    if (!startDate || !endDate) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ])
      setError('Please set your working hours.')

      return
    }
    let tempArr = []

    const start = new Date(
      1970,
      0,
      1,
      startDate.getHours(),
      startDate.getMinutes()
    )

    const end = new Date(1970, 0, 1, endDate.getHours(), endDate.getMinutes())

    user.preferedWorkingHours.forEach((element) => {
      tempArr.push({
        workDayNum: element.workDayNum,
        workDayStart: new firebase.firestore.Timestamp.fromDate(start),
        workDayEnd: new firebase.firestore.Timestamp.fromDate(end),
      })
    })

    user.preferedWorkingHours = tempArr
    updateUser(user)
  }

  const handleModal = (visibility) => {
    setTimeModalVisible(visibility)
  }
  const [selectedTime, setSelectedTime] = useState('startDate')
  const [isPickerShow, setIsPickerShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [timeError])

  // ------------------DELETE USER------------------

  const deleteUserHandler = () => {
    deleteUser(user.id)
    signOut()
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
            <Item>
              <CustomCompanyInput
                placeholder="Enter your company name ..."
                value={companyName}
                onChangeText={(event) => setCompanyName(event)}
                errorMessage={
                  companyName.length < 1 &&
                  'Company name must be at least 1 character long'
                }
              />
            </Item>
            <Item>
              <CustomCompanyInput
                placeholder="Enter your company join code ..."
                value={companyCode}
                onChangeText={setCompanyCode}
                errorMessage={
                  companyCode.length < 4 &&
                  'Company code must be at least 4 character long'
                }
              />
            </Item>
            <Item>
              <GooglePlacesInput setAddress={setAddress} />
            </Item>

            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setCompanyVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  sendCompanyData()
                  setCompanyVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
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
              disabled={user.travelPreference === 'driver'}
              iconOne="directions-car"
              title="Share My Car"
              onPress={() => {
                setButtonPressed(!buttonPressed)
                setTravelPreference('driver')
              }}
            />

            <CustomButtonIcon
              disabled={user.travelPreference === 'passenger'}
              iconOne="airline-seat-recline-extra"
              title="Get A Ride"
              onPress={() => {
                setButtonPressed(!buttonPressed)
                setTravelPreference('passenger')
              }}
            />
            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsTravelVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsTravelVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
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
            <Item>
              <CustomSimpleInput
                placeholder="Please enter your full name..."
                initialValue={formState.inputValues.userName}
                keyboardType="default"
                autoCapitalize="sentences"
                id="userName"
                autoCorrect={false}
                onInputChange={inputChangeHandler}
                errorText="Please enter a valid username."
                minLength={1}
                required
              />
            </Item>
            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsUsernameVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  usernameSubmitHandler()
                  setIsUsernameVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
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
            <Item>
              <GooglePlacesInput
                defaultValue={user.homeAddress}
                setAddress={setHAddress}
              />
            </Item>
            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsAddressVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  homeAddressSubmitHandler()
                  setIsAddressVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
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
            <View style={styles.btnContainer}>
              <View style={styles.poweredBtnContainer}>
                {workDays.map(
                  (item) =>
                    item.id <= 4 && (
                      <RoundButton
                        key={item.id}
                        item={item}
                        isSelected={item.isSelected}
                        toggleHandler={toggleHandler}
                      />
                    )
                )}
              </View>
              <View style={styles.poweredBtnContainer}>
                {workDays.map(
                  (item) =>
                    item.id > 4 && (
                      <RoundButton
                        key={item.id}
                        item={item}
                        isSelected={item.isSelected}
                        toggleHandler={toggleHandler}
                      />
                    )
                )}
              </View>
            </View>
            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsWorkDaysVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  submitHandler()
                  setIsWorkDaysVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modify Your Working Hours */}
      <TimeModal
        setIsPickerShow={setIsPickerShow}
        isPickerShow={isPickerShow}
        modalVisible={modalVisible}
        handleModal={handleModal}
        value={newEventState[selectedTime]}
        onChange={(e, date) => updateValue(date, selectedTime)}
      />

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
              title={
                newEventState.startDate
                  ? formatTime(newEventState.startDate)
                  : 'Start time'
              }
              onPress={() => {
                setModalVisible(true)
                setSelectedTime('startDate')
                setIsPickerShow(true)
              }}
            />

            <CustomButtonIcon
              title={
                newEventState.endDate
                  ? formatTime(newEventState.endDate)
                  : 'End time'
              }
              onPress={() => {
                setModalVisible(true)
                setSelectedTime('endDate')
                setIsPickerShow(true)
              }}
            />

            <View style={styles.btns}>
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsWorkHoursVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  timeSubmitHandler()
                  setIsWorkHoursVisible(false)
                }}
              >
                <Text>SAVE</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  setIsDeleteVisible(false)
                }}
              >
                <Text>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.poweredBtns}
                onPress={() => {
                  deleteUserHandler()
                  setIsDeleteVisible(false)
                }}
              >
                <Text>PROCEED</Text>
              </TouchableOpacity>
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
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#E1F5FD',
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
  poweredBtnContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 15,
    margin: 20,
    fontFamily: 'open-sans-regular',
  },
})
