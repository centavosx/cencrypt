import { ReactNode } from 'react'
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import styled from 'styled-components/native'

type OtherProps = {
  label?: string
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  onClickLeft?: () => void
  onClickRight?: () => void
  error?: string
}

export const StyledInput = ({
  label,
  rightIcon,
  leftIcon,
  onClickLeft,
  onClickRight,
  error,
  ...other
}: TextInputProps & OtherProps) => {
  return (
    <Container>
      {label && (
        <Text style={{ marginLeft: 2, fontWeight: 'bold' }} numberOfLines={1}>
          {label}
        </Text>
      )}
      <InputContainer>
        {!!leftIcon && onClickLeft ? (
          <TouchableOpacity
            onPress={onClickLeft}
            style={{ justifyContent: 'center' }}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : (
          leftIcon
        )}
        <Input {...other} />
        {!!rightIcon && onClickRight ? (
          <TouchableOpacity
            onPress={onClickRight}
            style={{ justifyContent: 'center' }}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : (
          rightIcon
        )}
      </InputContainer>
      {error && (
        <Text
          style={{
            marginLeft: 2,
            fontSize: 11,
            color: 'red',
            textTransform: 'capitalize',
          }}
          numberOfLines={1}
        >
          {error}
        </Text>
      )}
    </Container>
  )
}

const Container = styled(View)({
  flexDirection: 'column',
  gap: 4,
})

const InputContainer = styled(View)({
  border: '1px solid black',
  borderRadius: 8,
  padding: 8,
  flexDirection: 'row',
  gap: 8,
})

const Input = styled(TextInput)({
  flex: 1,
})
