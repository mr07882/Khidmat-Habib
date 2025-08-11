import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDlL1VCZRmnn2QgTpltVKZTcVJSeVPxdT8',
  authDomain: 'kpsiaj-testing.firebaseapp.com',
  databaseURL: 'https://kpsiaj-testing-default-rtdb.firebaseio.com',
  projectId: 'kpsiaj-testing',
  storageBucket: 'kpsiaj-testing.appspot.com',
  messagingSenderId: '282538128096',
  appId: '1:282538128096:web:1bd38fc9cf9b24581d5685',
  measurementId: 'G-XSC92JRN6W',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };