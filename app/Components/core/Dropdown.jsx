import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View} from 'react-native';
import Label from './Label';

const Dropdown = ({title, listMode = 'MODAL', ...props}) => {
  const [open, setOpen] = useState(false);
  props.placeholder = title;

  if (listMode === 'MODAL') {
    props.modalAnimationType = 'slide';
    props.modalTitle = title;
  }

  return (
    <View style={{marginBottom: 10}}>
      <Label required={props.required}>{props.label}</Label>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        style={{
          borderColor: '#bfbfbf',
          borderWidth: 0.7,
          shadowColor: '#bfbfbf',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 10,
        }}
        placeholderStyle={{
          color: '#5e5e5e',
          fontSize: 15,
        }}
        textStyle={{
          fontFamily: 'Poppins-Regular',
        }}
        listItemContainerStyle={{
          borderBottomWidth: 0.5,
          borderBottomColor: 'lightgrey',
          height: 55,
        }}
        listItemLabelStyle={{
          fontSize: 15,
        }}
        listMode={listMode}
        {...props}
      />
    </View>
  );
};

export default Dropdown;
