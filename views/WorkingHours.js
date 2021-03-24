import React, {useState} from 'react';
import {StyleSheet, Text, Button, View} from 'react-native';
import {color} from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
export const WorkingHours = ({navigation}) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const showTimepicker2 = () => {
    showMode('time');
  };

  return (
    <View style={styles.container}>
      <Text>Open up WorkingHours.js to start working on your app!</Text>
      <View>
        <Button onPress={showTimepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker2} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Button
        title="Submit"
        onPress={() => {
          navigation.navigate('setUpInit');
        }}
      />
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
  signUpContainer: {
    margin: 5,
    backgroundColor: 'yellow',
  },
});
