import React, {useState} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
import {color} from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

export const WorkingDays = ({navigation}) => {
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

  const showDatepicker = () => {
    showMode('date');
  };


  const showDatepicker2 = () => {
    showMode('date');
  };

  return (
    <View style={styles.container}>
       <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showDatepicker2} title="Show date picker!" />
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
            navigation.navigate('WorkingHours');
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
