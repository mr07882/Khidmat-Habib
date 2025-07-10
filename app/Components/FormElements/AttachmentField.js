
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { colors } from '../../Config/AppConfigData';

const AttachmentField = ({ label, file, onPick }) => {
  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      onPick(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.warn('Error picking file:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={handlePick} style={styles.button}>
        <Text style={styles.buttonText}>{file ? 'Change File' : 'Upload File'}</Text>
      </TouchableOpacity>
      {file && <Text style={styles.fileName}>{file.name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  button: {
    backgroundColor: colors.secondryColor,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  fileName: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
  },
});

export default AttachmentField;
