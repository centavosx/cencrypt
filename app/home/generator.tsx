import React from 'react'

import { Text, View, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { StyledButton } from '../../components/StyledButton'
import { useGenerate } from '../../hooks'
import { copyToClipboard } from '../../lib'
import { useRouter } from 'expo-router'

export default function GeneratorScreen() {
  const { generated, refresh } = useGenerate()
  return (
    <Container>
      <View
        style={{ flexDirection: 'column', height: '100%', gap: 2, padding: 24 }}
      >
        <Title>Password Generator</Title>
        <Description>
          Password is generated using entered word phrases.
        </Description>
        <StyledButton variant="secondary" onPress={() => refresh()}>
          Refresh
        </StyledButton>
        {generated.map((d, i) => (
          <Password key={d + ' ' + i}>{d}</Password>
        ))}
      </View>
    </Container>
  )
}

const Password = ({ children }: { children: string }) => {
  const { push } = useRouter()
  return (
    <View style={{ flexDirection: 'column', gap: 8, marginTop: 10 }}>
      <PasswordContainer>
        <GeneratedPassword>{children}</GeneratedPassword>
      </PasswordContainer>
      <View
        style={{ flexDirection: 'row', gap: 4, justifyContent: 'flex-end' }}
      >
        <StyledButton
          variant="secondary"
          onPress={() => copyToClipboard(children)}
          style={{ width: 80 }}
        >
          Copy
        </StyledButton>

        <StyledButton
          variant="secondary"
          style={{ width: 80 }}
          onPress={() =>
            push({ pathname: '/add', params: { password: children } })
          }
        >
          Save
        </StyledButton>
      </View>
    </View>
  )
}

const Container = styled(ScrollView)({
  background: 'black',
})

const Title = styled(Text)({
  color: 'white',
  fontSize: 18,
})
const Description = styled(Text)({
  color: 'white',
  fontSize: 12,
})

const PasswordContainer = styled(View)({
  padding: 8,
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderWidth: 1,
  borderColor: 'black',
  borderRadius: 8,
})

const GeneratedPassword = styled(Text)({
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
})
