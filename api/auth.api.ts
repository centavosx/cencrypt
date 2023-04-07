import { apiAuth } from './axios'

export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = LoginDto & {
  firstName: string
  lastName: string
}

export const me = async () => {
  return await apiAuth.get('/user/me')
}

export const login = async (data?: LoginDto) => {
  return await apiAuth.post('/user/login', data)
}

export const register = async (data?: RegisterDto) => {
  return await apiAuth.post('/user', data)
}
