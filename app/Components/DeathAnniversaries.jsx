import React, {useEffect, useState} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {
  compareDates,
  displayNetworkError,
  isNotNullOrEmpty,
  sendError,
  Storage,
} from '../Functions/Functions';
import {connect} from 'react-redux';
import Loader from './Loader';
import {deathAnniversaryStyles, tableStyles} from '../Styles';
import {TableRow, Text} from './core';
import {Table, Row} from 'react-native-table-component';
import {colors} from '../Config/AppConfigData';
import axios from 'axios';

const DeathAnniversaries = ({navigation, networkStatuse, id}) => {
  const [anniversaries, setAnniversaries] = useState([]);
  const [date, setDate] = useState('');
  const [networkStatus, setNetworkStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const {width, height} = useWindowDimensions();
  let tableWrapperHeight = height - 225;
  let widthArr = [45, 80, width - 226, 70];
  let graveyards = [];

  const checkIfDataExist = async () => {
    let data = await Storage.getData('anniversaries');

    if (isNotNullOrEmpty(data)) {
      if (
        isNotNullOrEmpty(data.date) &&
        (compareDates(data.date) || !networkStatuse)
      ) {
        setAnniversaries(data.anniversaries);
        setDate(data.date);
        setLoading(false);
      } else {
        fetchAnniversaries();
      }
    } else {
      if (networkStatuse) {
        fetchAnniversaries();
      } else {
        setNetworkStatus(false);
        setLoading(false);
      }
    }
  };

  const fetchAnniversaries = async () => {
    try {
      const appUrl = 'https://gs.kpsiaj.org';

      const response = await axios.get(
        `${appUrl}/api/v1/death/anniversaries/app`,
        {
          headers: {
            Origin: appUrl,
            Referer: appUrl + '/',
            Platform: 'Mobile App',
            Action: 'getDeathAnniversaries',
          },
        },
      );

      let {success, data} = response.data;

      if (success) {
        await Storage.storeData('anniversaries', data);
        setAnniversaries(data.anniversaries);
        setDate(data.date);
        setLoading(false);
      } else {
        sendError(navigation);
      }
    } catch (error) {
      sendError(navigation);
    }
  };

  const getYearFromDate = date => {
    const arr = date.split('-');
    return arr[arr.length - 1];
  };

  useEffect(() => {
    checkIfDataExist();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!networkStatus) {
    return displayNetworkError();
  }

  return (
    <View style={deathAnniversaryStyles.main}>
      <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
        <Text style={{fontFamily: 'Poppins-SemiBold'}}>Today ({date})</Text> is
        the death anniversary of following. You are requested to{' '}
        <Text style={{fontFamily: 'Poppins-SemiBold'}}>
          recite Sura Al Fateha
        </Text>{' '}
        for these members specially and in general for all marhoom momineen and
        mominaat.
      </Text>
      <ScrollView
        style={{...tableStyles.tableWrapper, height: tableWrapperHeight}}>
        <Table borderStyle={tableStyles.table}>
          <Row
            data={['S/N', 'Grave #', 'Name', 'Year']}
            widthArr={widthArr}
            style={tableStyles.thead}
            textStyle={tableStyles.theadText}
          />
          {anniversaries.map((ele, ind) => {
            let styles =
              ind % 2
                ? {backgroundColor: colors.primaryColor}
                : {backgroundColor: colors.tertiaryColor};
            let graveNo = isNotNullOrEmpty(ele.grave_category)
              ? ele.grave_category + '-' + ele.grave_no
              : ele.grave_no;
            let surname =
              isNotNullOrEmpty(ele.surname) && ele.surname !== '-'
                ? ele.surname
                : '';
            let expiryYear = getYearFromDate(ele.expiry_date);

            let data = [ind + 1, graveNo, `${ele.name} ${surname}`, expiryYear];

            if (!graveyards.includes(ele.graveyard)) {
              graveyards.push(ele.graveyard);
              return (
                <React.Fragment key={ind}>
                  <Row
                    data={[ele.graveyard]}
                    style={tableStyles.graveyardRow}
                    textStyle={tableStyles.theadText}
                  />
                  <TableRow data={data} styles={styles} widthArr={widthArr} />
                </React.Fragment>
              );
            }

            return (
              <TableRow
                key={ind}
                data={data}
                styles={styles}
                widthArr={widthArr}
              />
            );
          })}
        </Table>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {networkStatuse: state.reducer.networkStatuse};
};
export default connect(mapStateToProps)(DeathAnniversaries);
