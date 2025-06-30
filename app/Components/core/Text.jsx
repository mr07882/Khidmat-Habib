import React from 'react';
import {Text as NativeText} from 'react-native';

const Text = ({style = {}, selectable = true, children, ...props}) => {
  return (
    <NativeText
      selectable={selectable}
      style={{fontFamily: 'Poppins-Medium', ...style}}
      {...props}>
      {children}
    </NativeText>
  );
};

export default Text;
