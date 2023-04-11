import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Image, TouchableOpacity, Text } from 'react-native'
import { encrypted, meIcon, shield } from '../../assets/icons'
import { logo } from '../../assets/logo'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUser } from '../_layout'
import { useAppDispatch } from '../../redux/dispatch'
import { removeDataId } from '../../redux/slices/enrpytionsSlice'

export default function TabLayout() {
  const { push } = useRouter()
  const { user, logout } = useUser()
  const dispatch = useAppDispatch()

  const logoutUser = () => {
    dispatch(removeDataId())
    logout()
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#999999',
        headerLeft: () => (
          <Image
            source={logo}
            style={{ height: 32, width: 32, position: 'relative', left: 10 }}
          />
        ),
        headerLeftLabelVisible: true,
        headerLeftContainerStyle: { marginLeft: 10 },
        headerRightContainerStyle: { marginRight: 10 },
        headerBackground: (v) => null,
        headerBackgroundContainerStyle: { backgroundColor: '#D9D9D9' },
        headerTintColor: 'black',
        headerTitle: 'Cencrypt',
        headerTitleStyle: {
          fontWeight: 'bold',
          width: '100%',
        },
        tabBarStyle: {
          backgroundColor: '#D9D9D9',
        },
      }}
    >
      <Tabs.Screen
        name="manager"
        options={{
          title: 'Manager',
          tabBarIcon: ({ color }) => (
            <Image
              source={encrypted}
              style={{ tintColor: color, height: 28, width: 28 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: 'Generator',
          headerRight: () => (
            <TouchableOpacity onPress={() => push('/gen-settings')}>
              <Ionicons name="settings" color="black" size={28} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              source={shield}
              style={{ tintColor: color, height: 28, width: 28 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Me',
          headerRight: () => (
            <TouchableOpacity
              onPress={!!user ? logoutUser : () => push('/login')}
            >
              <Text>{!!user ? 'Logout' : 'Login'}</Text>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              source={meIcon}
              style={{ tintColor: color, height: 28, width: 28 }}
            />
          ),
        }}
      />
    </Tabs>
  )
}
