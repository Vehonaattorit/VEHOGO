import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import DriverAcceptRefuse from './DriverAcceptRefuse'
import {StyleSheet} from 'react-native';
import {Root} from 'native-base';
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font';
import NewRide from './NewRide';
import DriverStartRide from './DriverStartRide';
import DriverOnRoute from './DriverOnRoute'
import Chat from './Chat'

export default function App() {

  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
    setFontReady(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontReady) {
    console.log('Waiting for fonts...');
    return (
      <AppLoading/>
    );
  }
  return (
    <Root>
      <DriverOnRoute/>
      <StatusBar style="auto" />
    </Root>
  );
}

const styles = StyleSheet.create({


});
