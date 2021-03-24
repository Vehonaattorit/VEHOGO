import React from 'react';
import {StyleSheet, View} from 'react-native';
import {color} from '../constants/colors';
import {Button, Input, Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
export const Address = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.myCard}>
        <Card elevation={7}>
          <Input
            placeholder="Address"
            leftIcon={<Icon name="" size={24} color={color.grey} />}
            style={styles}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({comment: value})}
          />

          <Input
            placeholder="City"
            leftIcon={<Icon name="" size={24} color={color.grey} />}
            style={styles}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({comment: value})}
          />

          <Button
            style={styles.btns}
            type="outline"
            title="Submit"
            onPress={() => {
              navigation.navigate('WorkingDays');
            }}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myCard: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    color: 'white',
  },
});
