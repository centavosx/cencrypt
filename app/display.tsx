import React, { useCallback } from 'react'
import { useState } from 'react'
import { View, ScrollView, Image, Text } from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { StyledInput } from '../components/StyledInput'
import { useAppSelector } from '../redux/dispatch'

import { selectEncryptById } from '../redux/slices/enrpytionsSlice'

import { copyToClipboard, decryptText } from '../lib'

import { Redirect, useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function DisplayScreen() {
  const { id } = useLocalSearchParams()
  const data = useAppSelector((v) => selectEncryptById(v, id))
  const [display, setDisplay] = useState(false)
  const [display2, setDisplay2] = useState(false)
  const [display3, setDisplay3] = useState(false)
  const [key, setKey] = useState('')

  const checkKey = useCallback(() => {
    if (display3) setDisplay3(false)
    else {
      const ch = !!decryptText(data?.value ?? '', key)
      if (!ch) alert('Invalid pass key')
      setDisplay3(ch)
    }
  }, [key, data, display3, setDisplay3])

  if (!id) return <Redirect href={'/home'} />

  return (
    <Container>
      <Body>
        {data?.dataId && (
          <StyledInput label="Id" value={data?.dataId} editable={false} />
        )}
        <StyledInput label="Name" value={data?.name} editable={false} />
        <StyledInput label="User" value={data?.user} editable={false} />
        <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <StyledInput
            label="Value"
            placeholder="Type value to encrypt"
            secureTextEntry={!display}
            rightIcon={
              <Image
                source={display ? eyeHidden : eyeVisible}
                style={{ height: 18, width: 18, alignSelf: 'center' }}
              />
            }
            containerStyle={{ flex: 1 }}
            value={
              display3 ? decryptText(data?.value ?? '', key)! : data?.value
            }
            onClickRight={() => setDisplay((v) => !v)}
            editable={false}
          />
          <TouchableOpacity
            onPress={() =>
              !!(display3
                ? decryptText(data?.value ?? '', key)!
                : data?.value) &&
              copyToClipboard(
                display3 ? decryptText(data?.value ?? '', key)! : data?.value!
              )
            }
          >
            <Text style={{ textAlign: 'center', marginTop: 14 }}>Copy</Text>
          </TouchableOpacity>
        </View>
        <StyledInput
          label="Pass Key"
          placeholder="Enter Pass Key"
          secureTextEntry={!display2}
          rightIcon={
            <Image
              source={display2 ? eyeHidden : eyeVisible}
              style={{ height: 18, width: 18, alignSelf: 'center' }}
            />
          }
          onClickRight={() => setDisplay2((v) => !v)}
          value={key}
          onChangeText={(v) => setKey(() => v)}
          editable={!display3}
        />
        <StyledButton
          variant="primary"
          style={{ width: 120, alignSelf: 'flex-end' }}
          onPress={checkKey}
        >
          {!display3 ? 'Display value' : 'Cancel'}
        </StyledButton>
      </Body>
    </Container>
  )
}

const Container = styled(ScrollView)({
  background: '#D9D9D9',
})
const Body = styled(View)({
  flexDirection: 'column',
  flex: 1,
  gap: 8,
  height: '100%',
  padding: 24,
})
