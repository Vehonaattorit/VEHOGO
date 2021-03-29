import React from 'react';
import {FlatList} from 'react-native';
import {View} from 'native-base';
import {CompanyListItem} from '../components/CompanyListItem'

export const CompanyList = ({navigation, companyData}) => {
  return (
    <View>
      <FlatList
        data={companyData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <CompanyListItem singleItem={item} navigation={navigation} />
        }
      />
    </View>
  );
};

export default CompanyList;
