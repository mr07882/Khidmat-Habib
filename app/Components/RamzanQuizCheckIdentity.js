import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RamzanQuizUserInfoForm from './RamzanQuizUserInfoFrom';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {getAllFormsFromThisUser} from '../Redux/actions/authAction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {DropSlideCard} from '../shared/dropSlideCard';
import {ICONS} from '../constants';
import {Text} from './core';

const RamzanQuizCheckIdentity = props => {
  const [state, setState] = useState({
    isaddUserFormEnable: false,
    isUpdate: false,
  });
  const {childUsers, user, rullsAndRegulations} = useSelector(
    state => state.reducer,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.userDetail && user.userDetail.emailAddress) {
      let userDetail = user.userDetail;
      dispatch(getAllFormsFromThisUser(userDetail.emailAddress));
    }
  }, []);

  const closeUserForm = () => {
    if (user && user.userDetail && user.userDetail.emailAddress) {
      let userDetail = user.userDetail;
      dispatch(getAllFormsFromThisUser(userDetail.emailAddress));
      setState({isaddUserFormEnable: false, isUpdate: false});
    }
  };
  const displayUsers = () => {
    if (childUsers && childUsers.length > 0) {
      return (
        <View style={{marginTop: 75}}>
          <View>
            <Text style={{textAlign: 'center', padding: 10, fontSize: 16}}>
              Please select a user from the list below or add a new user to
              attempt available quiz
            </Text>
          </View>
          <FlatList
            data={childUsers}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate(`RamzanQuizStart`, item.perFormUid)
                }
                style={{
                  height: 60,
                  backgroundColor: '#ECEAE4',
                  padding: 5,
                  margin: 8,
                  borderRadius: 5,
                  justifyContent: 'space-evenly',
                  elevation: 5,
                }}>
                <Text
                  style={{fontSize: 20, textAlign: 'center', color: 'black'}}>
                  {item.fullName}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setState({
                      isaddUserFormEnable: true,
                      isUpdate: item.perFormUid,
                    });
                  }}
                  style={{position: 'absolute', right: 5}}>
                  <ICONS.MaterialCommunityIcons
                    name={'account-edit'}
                    size={40}
                    color={'#725054'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.perFormUid.toString()}
          />
        </View>
      );
    } else {
      return (
        <View style={{marginTop: 75}}>
          <Text style={{textAlign: 'center', padding: 10, fontSize: 16}}>
            Please select a user from the list below or add a new user to
            attempt available quiz
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      {!state.isaddUserFormEnable && (
        <>
          {!!rullsAndRegulations && !!rullsAndRegulations.quiz && (
            <DropSlideCard
              navigation={props.navigation}
              mainTitle={'Rules & Regulations'}
              isHtml={true}
              content={rullsAndRegulations.quiz}
            />
          )}
          <TouchableOpacity
            onPress={props.logOut}
            style={{
              backgroundColor: '#725054',
              height: 50,
              width: 60,
              borderBottomLeftRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 3,
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
            <Text style={{color: 'white'}}>LogOut</Text>
            <FontAwesome
              name="power-off"
              style={{color: 'white', fontSize: 18}}
            />
          </TouchableOpacity>
        </>
      )}
      {state.isaddUserFormEnable ? (
        <RamzanQuizUserInfoForm
          childUsers={childUsers}
          isUpdate={state.isUpdate}
          userInfo={user.userDetail}
          closeUserForm={closeUserForm}
        />
      ) : (
        displayUsers()
      )}
      {!state.isaddUserFormEnable && childUsers && childUsers.length < 5 && (
        <>
          <TouchableOpacity
            onPress={() => {
              setState({...state, isaddUserFormEnable: true});
            }}
            style={{
              backgroundColor: 'green',
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 25,
              right: 20,
              elevation: 3,
            }}>
            <Text style={{color: 'white'}}>Add</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RamzanQuizCheckIdentity;
