import { Protected } from '../entities'
import { apiAuth } from './axios'

export const synchronize = async (data?: Protected[]) => {
  return await apiAuth.post('/protected', { data })
}

export const getSyncedData = async () => {
  return await apiAuth.get('/protected')
}

export const deleteData = async (id: string) => {
  return await apiAuth.delete('/protected/' + id)
}
