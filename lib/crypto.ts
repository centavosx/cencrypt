import CryptoJS from 'crypto-js'
import { ENC_KEY } from '@env'

export const encryptText = (
  value: string,
  pKey: string,
  i?: number
): string => {
  if (!!i && i > 1) return value

  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  const key = CryptoJS.PBKDF2(pKey, salt, {
    keySize: 128 / 32,
  })

  const encrpyted = CryptoJS.AES.encrypt(value, key, { iv })
  const final = salt.toString() + iv.toString() + encrpyted.toString()
  return encryptText(final, ENC_KEY, (i ?? 0) + 1)
}

export const decryptText = (
  value: string,
  pKey: string,
  i?: number
): string | null => {
  try {
    if (!!i && i > 1) return value

    const keyP = !i ? ENC_KEY : pKey

    const salt = CryptoJS.enc.Hex.parse(value.substring(0, 32))
    const iv = CryptoJS.enc.Hex.parse(value.substring(32, 64))
    const encrypted = value.substring(64)

    const key = CryptoJS.PBKDF2(keyP, salt, {
      keySize: 128 / 32,
    })

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv })
    return decryptText(
      decrypted.toString(CryptoJS.enc.Utf8),
      pKey,
      (i ?? 0) + 1
    )
  } catch {
    return null
  }
}

export const hashValue = (value: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  const key = CryptoJS.PBKDF2(value, salt, {
    keySize: 128 / 32,
  })

  const encrpyted = CryptoJS.AES.encrypt(value, key, { iv: iv })
  const final = salt.toString() + iv.toString() + encrpyted.toString()
  return final
}

export const compare = (value: string, hashValue: string) => {
  try {
    const salt = CryptoJS.enc.Hex.parse(hashValue.substring(0, 32))
    const iv = CryptoJS.enc.Hex.parse(hashValue.substring(32, 64))
    const encrypted = hashValue.substring(64)

    const key = CryptoJS.PBKDF2(value, salt, {
      keySize: 128 / 32,
    })

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv })
    return decrypted.toString(CryptoJS.enc.Utf8) === value
  } catch {
    return false
  }
}
