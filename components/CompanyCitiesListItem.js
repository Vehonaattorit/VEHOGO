import {StyleSheet} from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import {Content, Card, CardItem, Text, Left, Icon, Right, Button} from 'native-base'


export const CompanyCitiesListItem = ({city, setShowJoin, setShowBtns, setCityFilter}) => {

  return (
    <Content>
      <Card style={styles.list} >
        <CardItem style={styles.item}>
          <Left>
            <Icon active name="location-outline" />
            <Text style={styles.title}>{city}</Text>
          </Left>
          <Right>
            <Button onPress={() => {
              setCityFilter(city)
              setShowJoin(true)
              setShowBtns(false)
            }}
            ><Text>Select</Text></Button>
          </Right>

        </CardItem>
      </Card>
    </Content>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  button: {
    marginTop: 10,
  },
  companyCities: {

  },
})
