import React, { useEffect } from 'react'
import { Tabs, useNavigation, useRouter } from 'expo-router'
import { useColorScheme, Image, BackHandler } from 'react-native'
import { encrypted, shield } from '../../assets/icons'
import { logo } from '../../assets/logo'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const v = useNavigation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#999999',
        headerLeft: () => (
          <Image source={logo} style={{ height: 32, width: 32 }} />
        ),
        headerLeftLabelVisible: true,
        headerLeftContainerStyle: { marginLeft: 10 },
        headerBackground: (v) => null,
        headerBackgroundContainerStyle: { backgroundColor: '#D9D9D9' },
        headerTintColor: 'black',
        headerTitle: 'Cencrypt',
        headerTitleStyle: { fontWeight: 'bold', marginLeft: -10 },
        tabBarStyle: {
          backgroundColor: '#D9D9D9',
        },
      }}
    >
      <Tabs.Screen
        name="manager"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={encrypted}
              style={{ tintColor: color, height: 28, width: 28 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={shield}
              style={{ tintColor: color, height: 28, width: 28 }}
            />
          ),
        }}
      />
    </Tabs>
  )
}
