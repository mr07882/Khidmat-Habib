import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { checkUserLogin } from '../Functions/Functions';
import { useDispatch } from 'react-redux';
import { setUserId } from '../Redux/actions/authAction';

const AuthCheck = ({ onAuthCheckComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { isLoggedIn, jcic } = await checkUserLogin();
      
      if (isLoggedIn && jcic) {
        // User is logged in, set the user ID in Redux
        dispatch(setUserId(jcic));
        onAuthCheckComplete({ isLoggedIn: true, jcic });
      } else {
        // User is not logged in
        onAuthCheckComplete({ isLoggedIn: false, jcic: null });
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
      onAuthCheckComplete({ isLoggedIn: false, jcic: null });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#715054" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AuthCheck; 