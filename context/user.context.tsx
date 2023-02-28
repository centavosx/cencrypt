import { createContext, ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text } from 'react-native'
import {
  resetTries,
  selectBanned,
  selectNumberOfTries,
  setBannedTime,
} from '../redux/slices/passwordSlice'

export const UserContext = createContext<{
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => '',
})

export const UserProvider = ({
  children,
}: {
  children: ((cb: { isLoggedIn?: boolean }) => ReactNode) | ReactNode
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const dispatch = useDispatch()
  const tries = useSelector(selectNumberOfTries)
  const banned = useSelector(selectBanned)
  const today = new Date()

  useEffect(() => {
    if (tries === 3) {
      const date = new Date()
      date.setSeconds(date.getSeconds() + 120)
      dispatch(setBannedTime(date.toString()))
      dispatch(resetTries())
    }
  }, [tries])

  if (banned && today < banned) {
    const unixTime = (today.getTime() - new Date().getTime()) / 1000
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
          You have been restricted for {unixTime} seconds. Please try again
          later
        </Text>
      </View>
    )
  }

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {typeof children === 'function' ? children({ isLoggedIn }) : children}
    </UserContext.Provider>
  )
}
