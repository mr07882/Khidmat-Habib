import React from 'react';
import Input from './Input';

const TextArea = ({...props}) => {
  return (
    <Input
      multiline={true}
      style={{
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        height: 150,
        textAlignVertical: 'top',
        borderWidth: 0.5,
        borderColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 10,
      }}
      {...props}
    />
  );
};

export default TextArea;
