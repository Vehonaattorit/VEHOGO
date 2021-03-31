import {Button, Left, Right, View, Content, Card, CardItem, Text} from 'native-base';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native'
import {CompanyListItem} from '../components/CompanyListItem'

export const RideStartBar = ({navigation}) => {

  const [showStart, setShowStart] = useState(true)

  return (

    <View>
        <Card>
          <CardItem>
            <Left>
              {showStart ? (
                <Text>You can start your next ride</Text>
              ) : (
                <Text>Your next ride is at</Text>
              )}

            </Left>
            <Right>
              {showStart ? (
                <Button ><Text>Start</Text></Button>
              ) : (
                <Text>07:45</Text>
              )
              }
            </Right>
          </CardItem>
        </Card>
    </View>

  )
}

const styles = StyleSheet.create({

})
