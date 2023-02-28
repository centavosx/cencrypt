import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Router } from '../../types'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  View,
  BackHandler,
} from 'react-native'
import styled from 'styled-components/native'
import { add } from '../../assets/icons'
import { logo } from '../../assets/logo'

export default function PasswordScreen() {
  const navigation = useRouter()

  return (
    <Container>
      <FlatList
        contentContainerStyle={{ flexDirection: 'column', gap: 12 }}
        data={['dwadwa', 'dwadw']}
        renderItem={(v) => (
          <Card>
            <Image source={logo} />
            <CardBody>
              <TextAndId text="Facebook" id="dwadwada-dwadaw-dwada-wdaw" />
              <Text style={{ fontWeight: 'bold' }}>email</Text>
            </CardBody>
          </Card>
        )}
      />
      <AddEncrypt navigation={navigation} />
    </Container>
  )
}

const TextAndId = ({ text, id }: { text: string; id: string }) => {
  return (
    <Text numberOfLines={1}>
      <Text style={{ fontWeight: 'bold' }}>{text}</Text>:{' '}
      <Text style={{ color: 'gray' }}>{id}</Text>
    </Text>
  )
}

const AddEncrypt = ({ navigation: { push } }: { navigation: Router }) => {
  return (
    <TouchableOpacity onPress={() => push('/inapp')}>
      <Image
        source={add}
        style={{
          height: 45,
          width: 45,
          tintColor: 'white',
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
          right: 0,
        }}
      />
    </TouchableOpacity>
  )
}

const Container = styled(View)({
  padding: 24,
  flexDirection: 'column',
  height: '100%',
  background: 'black',
})

const CardBody = styled(View)({
  flex: 1,
  flexDirection: 'column',
  gap: 1,
})

const Card = styled(TouchableOpacity)({
  padding: 8,
  paddingTop: 14,
  paddingBottom: 14,
  backgroundColor: 'white',

  borderWidth: 1,
  borderRadius: 8,
  width: '100%',

  //ios
  shadowOpacity: 15,
  shadowOffset: { width: 0, height: -7 },
  shadowRadius: 8,

  //android

  elevation: 7,
  flexDirection: 'row',
  gap: 8,

  alignItems: 'center',
})
