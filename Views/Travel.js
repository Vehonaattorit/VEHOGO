import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color} from '../constants/colors';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
export const Travel = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <Button
          style={styles.btn}
          title="Share My Car "
          type="clear"
          iconRight
          onPress={() => {
            navigation.navigate('Address');
          }}
          icon={<Icon name="arrow-right" size={15} color="white" />}
          titleStyle={styles.btnTitle}
        />
        <Button
          style={styles.btn}
          type="clear"
          title="Get A Ride "
          onPress={() => {
            navigation.navigate('Address');
          }}
          iconRight
          icon={<Icon name="arrow-right" size={15} color="white" />}
          titleStyle={styles.btnTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primaryLight,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    marginBottom: '5%',
    width: '100%',
  },
  btn: {
    margin: 5,
    alignSelf: 'stretch',

  },
  btnTitle:{
    width: '90%',
    fontSize: 35,
    color: color.pText
  }
});
