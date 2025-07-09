// app/config.js

import { Platform } from 'react-native';

// Use process.env for web/Node, but for React Native, use a fallback or a library like react-native-dotenv if needed
// For now, fallback to default if not set
export const API_URL =
  typeof process !== 'undefined' && process.env && process.env.API_URL
    ? process.env.API_URL
    : Platform.OS === 'android'
    ? 'http://10.0.2.2:5000' //Backend URL. Local host or online server
    : 'http://localhost:5000';



//http://10.0.2.2:5000 //local host backend url for android on local machine 
