import React from 'react'
import { View, Image } from 'react-native'
import { logo } from '../assets/logo'
import styled from 'styled-components/native'

export const Header = () => {
  return (
    <HeaderContainer>
      <Image source={logo} />
    </HeaderContainer>
  )
}

const HeaderContainer = styled(View)({
  height: 48,
  flexDirection: 'row',
  paddingLeft: 16,
  paddingTop: 40,
})
