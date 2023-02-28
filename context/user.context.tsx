import { createContext, ReactNode, useContext, useState } from 'react'

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
  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {typeof children === 'function' ? children({ isLoggedIn }) : children}
    </UserContext.Provider>
  )
}
