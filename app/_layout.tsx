import { createContext, useCallback, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme, BackHandler, View, Text, Platform } from 'react-native'
import { Provider } from 'react-redux'
import { persistor, store } from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import * as LocalAuthentication from 'expo-local-authentication'
import { UserProvider } from '../context/user.context'
import { usePreventScreenCapture } from 'expo-screen-capture'
import { useApi } from '../hooks'
import { me } from '../api'
import { User } from '../entities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useContext } from 'react'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

type DataType = {
  user: User | null
  refetch: () => void
  logout: () => void
}

export const AuthContext = createContext<DataType>({} as DataType)

export const useUser = () => useContext(AuthContext)

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  const [authenticated, setAuthenticated] = useState<boolean>()
  const { data, refetch, isFetching, error: e } = useApi<User, any>(me)

  const logout = useCallback(async () => {
    await AsyncStorage.clear()
    refetch()
  }, [refetch])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  const exitApp = () => {
    BackHandler.exitApp()
    return true
  }

  usePreventScreenCapture()

  useEffect(() => {
    const auth = async () => {
      const resp = await LocalAuthentication.authenticateAsync()
      setAuthenticated(resp.success)
    }

    if (authenticated === undefined && loaded) auth()
  }, [authenticated, loaded, setAuthenticated])

  const provider: DataType = {
    user: data,

    refetch,
    logout,
  }

  if (authenticated === false) {
    exitApp()
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          You are not allowed allowed to open this app. Restart the app to try
          it again
        </Text>
      </View>
    )
  }

  if (
    !loaded ||
    authenticated === undefined ||
    (authenticated === undefined && isFetching)
  )
    return <SplashScreen />
  return (
    <AuthContext.Provider value={provider}>
      <RootLayoutNav />
    </AuthContext.Provider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const { user } = useUser()
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <UserProvider>
          {({ isLoggedIn }) => (
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <Stack>
                {!isLoggedIn ? (
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                ) : (
                  <Stack.Screen name="home" options={{ headerShown: false }} />
                )}

                {isLoggedIn && (
                  <Stack.Screen
                    name="add"
                    options={{
                      presentation: 'modal',
                      headerTitle: 'Add new password',
                    }}
                  />
                )}
                {isLoggedIn && (
                  <Stack.Screen
                    name="display"
                    options={{
                      presentation: 'modal',
                      headerTitle: 'Display password',
                    }}
                  />
                )}
                {isLoggedIn && (
                  <Stack.Screen
                    name="gen-settings"
                    options={{
                      presentation: 'modal',
                      headerTitle: 'Generator Settings',
                    }}
                  />
                )}

                {!user && (
                  <Stack.Screen
                    name="register"
                    options={{
                      presentation: 'modal',
                      headerTitle: 'Register',
                    }}
                  />
                )}

                {!user && (
                  <Stack.Screen
                    name="login"
                    options={{
                      presentation: 'modal',
                      headerTitle: 'Login',
                    }}
                  />
                )}
              </Stack>
            </ThemeProvider>
          )}
        </UserProvider>
      </PersistGate>
    </Provider>
  )
}
