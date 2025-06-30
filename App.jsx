import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './app/Redux/Store.js';
import MainIndex from './app/MainIndex.js';
import {SystemBars} from 'react-native-edge-to-edge';
import {LogBox} from 'react-native';

let App = () => {
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SystemBars style="light" hidden={false} />
        <MainIndex />
      </PersistGate>
    </Provider>
  );
};

App = React.memo(App);

export default App;
