import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  createBottomTabNavigator
} from "react-navigation-tabs";
import {
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import {
  createStackNavigator
} from "react-navigation-stack";

import {Provider} from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'

import AddContactScreen from "./screens/AddContactScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ContactListScreen from "./screens/ContactListScreen";
import ContactDetailsScreen from "./screens/ContactDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import {fetchUsers} from './api'
import contacts from "./contacts";
import {store, persistor} from './redux/store'

const MainStack = createStackNavigator(
  {
    ContactList: ContactListScreen,
    ContactDetails: ContactDetailsScreen,
    AddContact: AddContactScreen,
  },
  {
    initialRouteName: 'ContactList',
    navigationOptions: {
      headerTintColor: '#a41034',
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
  }
)

MainStack.navigationOptions = {
  tabBarIcon: ({focused, tintColor}) => (
    <Ionicons name={`ios-contacts${focused ? '' : '-outline'}`} size={25} color={tintColor} />
  ),
}

const MainTabs = createBottomTabNavigator(
  {
    Contacts: MainStack,
    Settings: SettingsScreen,
  },
  {
    tabBarOptions: {
      activeTintColor: '#a41034',
    },
  }
)

const AppNavigator = createSwitchNavigator({
  Login: LoginScreen,
  Main: MainTabs,
})

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = {
    contacts,
  }

  componentDidMount() {
    this.getUsers()
  }

  getUsers = async () => {
    const results = await fetchUsers()
    this.setState({contacts: results})
  }

  addContact = newContact => {
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }))
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer
          screenProps={{
            contacts: this.state.contacts,
            addContact: this.addContact
          }}
      />
      </Provider>
    )
  }
}
