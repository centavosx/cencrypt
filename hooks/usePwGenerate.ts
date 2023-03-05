import { useCallback, useEffect, useState } from 'react'
import { generatePassword } from '../lib/pass-gen'
import { useAppSelector } from '../redux/dispatch'
import { selectGenSettings } from '../redux/slices/genSettingsSlice'
import { faker } from '@faker-js/faker'
import { resolve } from 'path'

export const useGenerate = () => {
  const [generated, setGenerated] = useState<string[]>([])
  const data = useAppSelector(selectGenSettings)
  const generatePasswords = useCallback(async () => {
    setGenerated(
      generatePassword(
        [
          (data.phrase1 || faker.internet.password(8)) as string,
          (data.phrase2 || faker.internet.password(8)) as string,
          (data.phrase3 || faker.internet.password(8)) as string,
          (data.phrase4 || faker.internet.password(8)) as string,
          (data.phrase5 || faker.internet.password(8)) as string,
          (data.phrase6 || Math.floor(Math.random() * 60)) as number,
          (data.phrase7 || Math.floor(Math.random() * 60)) as number,
        ],
        data.numberOfGenerated
      )
    )
  }, [setGenerated, data])

  useEffect(() => {
    generatePasswords()
  }, [data, generatePasswords])

  return { generated, refresh: () => generatePasswords() }
}
