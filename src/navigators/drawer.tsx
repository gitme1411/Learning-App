import { StyleSheet } from 'react-native'
import React, { } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawer from '../components/CustomDrawer'
import AppStack from './AppStack'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({ navigation }: any) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: styles.container,
        drawerType: 'back',
        swipeEnabled: true,
        drawerStatusBarAnimation: 'slide',
        headerShown: false,
        drawerHideStatusBarOnOpen: false,
        keyboardDismissMode: 'none',
      }}
      drawerContent={props => <CustomDrawer props={props} navigation={navigation} />}
    >
      <Drawer.Screen name="AppStack" component={AppStack} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
  },
})

export default DrawerNavigator