import { ReactNode } from 'react'
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
  ViewStyle,
  Text,
} from 'react-native'
import styled from 'styled-components/native'

export type OtherProps = {
  label?: string
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  onClickLeft?: () => void
  onClickRight?: () => void
  error?: string
  containerStyle?: ViewStyle
  variant?: 'primary' | 'secondary'
}

export const StyledInput = ({
  label,
  rightIcon,
  leftIcon,
  onClickLeft,
  onClickRight,
  error,
  containerStyle,
  variant,
  style,
  placeholderTextColor,
  ...other
}: TextInputProps & OtherProps) => {
  const variantStyle =
    !variant || variant === 'primary' ? 'primary' : 'secondary'

  return (
    <Container style={containerStyle}>
      {label && (
        <Text
          style={{
            marginLeft: 2,
            fontWeight: 'bold',
            color: variant === 'secondary' ? 'white' : 'black',
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
      <InputContainer
        style={{ borderColor: variant === 'secondary' ? 'white' : 'black' }}
      >
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
        <Input
          placeholderTextColor={
            placeholderTextColor ?? variantStyle === 'secondary'
              ? 'rgba(255,255,255,0.5)'
              : undefined
          }
          style={{
            color: variant === 'secondary' ? 'white' : 'black',
            ...style,
          }}
          {...other}
        />
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
