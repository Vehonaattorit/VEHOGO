import React from 'react'
import {Platform} from 'react-native'

import {HeaderButton} from 'react-navigation-header-buttons'
import {Ionicons} from '@expo/vector-icons'
import {color} from '../constants/colors'

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={props.iconComponent}
      iconSize={23}
      color={color.darkBlue}
    />
  )
}

export default CustomHeaderButton
