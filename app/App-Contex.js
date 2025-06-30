// import React from 'react';
// import database from '@react-native-firebase/database';
// import NetInfo from "@react-native-community/netinfo";

// const db = database()

// const initialState = {
//     deathNewsData: {},
// }
//asd
// export const AppContext = React.createContext();

// export const AppConsumer = AppContext.Consumer;

// export class AppProvider extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = initialState;
//     }

//     setDeathNewsData = (deathNewsData) => {
//         this.setState({ deathNewsData })
//     }

//     watchPersonData = () => {
//         db.ref("deathNews").on("value", function (snapshot) {
//             var deathNewsData = snapshot.val();
//             this.setPersonData(deathNewsData);
//         }.bind(this), function (error) { });
//     }

//     render() {
//         return (
//             <AppContext.Provider value={{
//                 deathNewsData: this.state.deathNewsData,
//                 watchPersonData: this.watchPersonData,
//             }}>
//                 {this.props.children}
//             </AppContext.Provider>
//         )
//     }
// }