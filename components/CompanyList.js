import React from 'react';
import {FlatList} from 'react-native';
import {StyleSheet} from 'react-native'
import {CompanyListItem} from '../components/CompanyListItem'

export const CompanyList = ({navigation, companyData}) => {
  return (

      <FlatList
        data={companyData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) =>
          <CompanyListItem singleItem={item} navigation={navigation} />
        }
      />
  );
};

export default CompanyList;
