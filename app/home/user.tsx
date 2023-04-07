import { useRouter } from 'expo-router'
import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { StyledButton } from '../../components/StyledButton'
import { useApi } from '../../hooks'
import { useUser } from '../_layout'

const UserScreen = () => {
  return (
    <Container>
      <View
        style={{ flexDirection: 'column', height: '100%', gap: 2, padding: 24 }}
      >
        <UserView />
      </View>
    </Container>
  )
}

const UserView = () => {
  const { user } = useUser()
  const { push } = useRouter()

  return (
    <View style={{ gap: 2, width: '100%', flexDirection: 'column' }}>
      {!user ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <WhiteText style={{ flex: 1 }}>Not Logged In! </WhiteText>
          <StyledButton
            variant="secondary"
            style={{ width: 80, alignSelf: 'flex-end' }}
            onPress={() => push('/login')}
          >
            Login
          </StyledButton>
        </View>
      ) : (
        <>
          <WhiteText numberOfLines={1}>ID: {user.id}</WhiteText>
          <WhiteText numberOfLines={1}>First name: {user.firstName}</WhiteText>
          <WhiteText numberOfLines={1}>Last name: {user.lastName}</WhiteText>
          <WhiteText numberOfLines={1}>Email: {user.email}</WhiteText>
        </>
      )}
    </View>
  )
}

export default UserScreen

const WhiteText = styled(Text)({
  color: 'white',
})

const Container = styled(ScrollView)({
  background: 'black',
})
