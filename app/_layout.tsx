import { useState } from 'react'
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

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(
    Platform.OS === 'web' ? true : undefined
  )

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  const exitApp = () => {
    BackHandler.exitApp()
    return true
  }

  useEffect(() => {
    const auth = async () => {
      const resp = await LocalAuthentication.authenticateAsync()
      setAuthenticated(resp.success)
    }

    if (authenticated === undefined) auth()
  }, [authenticated, setAuthenticated])

  if (authenticated === false) {
    exitApp()
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          You are not allowed allowed to access this app. Restart the app to try
          it again
        </Text>
      </View>
    )
  }

  if (!loaded || authenticated === undefined) return <SplashScreen />
  if (loaded) return <RootLayoutNav />
}

function RootLayoutNav() {
  const [login, setLogin] = useState(false)
  const colorScheme = useColorScheme()
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
                  <>
                    <Stack.Screen
                      name="home"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="add"
                      options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen
                      name="display"
                      options={{ presentation: 'modal' }}
                    />
                  </>
                )}
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'modal' }}
                />
              </Stack>
            </ThemeProvider>
          )}
        </UserProvider>
      </PersistGate>
    </Provider>
  )
}
