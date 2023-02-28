import styled from 'styled-components/native'
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native'

const theme = {
  primary: {
    backgroundColor: 'black',
    color: 'white',
  },
  secondary: {
    backgroundColor: 'white',
    color: 'black',
  },
}

type Variant = {
  variant?: 'primary' | 'secondary'
}

export const StyledButton = ({
  variant,
  children,
  style,
  ...others
}: TouchableOpacityProps & Variant) => {
  return (
    <Touchable
      style={[variant ? theme[variant] : undefined, style]}
      {...others}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            color: variant ? theme[variant].color : undefined,
            textAlign: 'center',
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Touchable>
  )
}

const Touchable = styled(TouchableOpacity)({
  padding: 8,
  borderRadius: 8,
})
