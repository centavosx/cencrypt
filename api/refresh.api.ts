import { apiRefreshAuth } from './axios'
import { Token } from '../entities'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AxiosResponse } from 'axios'

export const refreshToken = async (): Promise<Token> => {
  const response: AxiosResponse<Token, any> = await apiRefreshAuth.get(
    '/refresh'
  )

  const { accessToken, refreshToken }: Token = response.data

  await AsyncStorage.setItem('accessToken', accessToken)
  await AsyncStorage.setItem('refreshToken', refreshToken)

  return { accessToken, refreshToken }
}
