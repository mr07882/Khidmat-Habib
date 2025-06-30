// import React from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import * as Screens from '../Screens';
// import {View} from 'react-native';
// import {navigatorStyles} from '../Config/StylesCss';
// import {HeaderRight} from './components';
//
// const MyTabBar = ({navigation}) => {
//   return <View></View>;
// };
//
// const Tab = createBottomTabNavigator();
//
// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       tabBar={props => <MyTabBar {...props} />}
//       screenOptions={{
//         headerTitle: '',
//         headerStyle: navigatorStyles.headerStyle,
//         headerRight: HeaderRight,
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={Screens.Home}
//         options={{headerShown: false}}
//       />
//     </Tab.Navigator>
//   );
// };
//
// export default TabNavigator;
