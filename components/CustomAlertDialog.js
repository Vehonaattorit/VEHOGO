import React, {useState} from 'react'
import {View, StyleSheet, Button, Text, Image} from 'react-native'
import {Dialog} from 'react-native-simple-dialogs'
export const Alert = ({title, message, visibility}) => {
  const [alertVisible, setAlertVisible] = useState(true)
  return (
    <View style={styles.container}>
      <View style={styles.poweredContainer}>
        <Dialog
          title={title}
          animationType="fade"
          contentStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onTouchOutside={() => setAlertVisible(false)}
          visible={setAlertVisible(visibility)}
        >
          <Text style={styles.messageText}>{message}</Text>
          <Button
            onPress={() => setAlertVisible(false)}
            style={{marginTop: 10}}
            title="CLOSE"
          />
        </Dialog>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },

  messageText: {
    fontSize: 15,
    margin: 10,
    textAlign: 'center',
  },
})
