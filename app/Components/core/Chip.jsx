import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from './Text';
import {CheckIcn} from '../../Helpers/icons';
import {colors} from '../../Config/AppConfigData';

const Chip = ({label = '', checked = true, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        backgroundColor: checked ? colors.secondryColor : 'white',
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 15,
        borderWidth: checked ? 1 : 0,
        borderColor: checked ? colors.secondryColor : 'lightgray',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        ...props.style,
      }}>
      {checked && (
        <CheckIcn
          styles={{
            color: '#ffffff',
            fontSize: 15,
            marginRight: 8,
            marginLeft: -5,
          }}
        />
      )}
      <Text style={{color: checked ? '#ffffff' : '#000000', fontSize: 15}}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
