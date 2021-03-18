import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import DriverAcceptRefuse from '../VehoKimppa/DriverAcceptRefuse'
import {StyleSheet} from 'react-native';
import {Root} from 'native-base';
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font';
import {RidesView} from './views/rides_view';


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
      <RidesView></RidesView>
      <StatusBar style="auto" />
    </Root>
  );
}

const styles = StyleSheet.create({


});
