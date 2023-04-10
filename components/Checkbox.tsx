import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

export type CheckBoxType = {
  variant?: 'primary' | 'secondary'
  size?: number
  value?: boolean
  onChange?: (check: boolean) => void
}

export const CheckBox = ({ variant, size, onChange, value }: CheckBoxType) => {
  const [check, setChecked] = useState(value ?? false)
  const variantStyle =
    !variant || variant === 'primary' ? 'primary' : 'secondary'

  const name = check
    ? variantStyle === 'primary'
      ? 'checkbox'
      : 'checkbox-outline'
    : variantStyle === 'primary'
    ? 'square'
    : 'square-outline'

  useEffect(() => {
    if (check !== value) onChange?.(check)
  }, [onChange, check, value])

  return (
    <TouchableOpacity onPress={() => setChecked((v) => !v)}>
      <Ionicons name={name} size={size ?? 16} color={'white'} />
    </TouchableOpacity>
  )
}
