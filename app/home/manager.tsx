import React from 'react'
import { useRouter, Link } from 'expo-router'
import { Router } from '../../types'
import { Text, TouchableOpacity, Image, FlatList, View } from 'react-native'
import styled from 'styled-components/native'
import { add } from '../../assets/icons'
import { logo } from '../../assets/logo'
import { useSelector } from 'react-redux'
import { selectEncrypt } from '../../redux/slices/enrpytionsSlice'

export default function PasswordScreen() {
  const encrypted = useSelector(selectEncrypt)
  const navigation = useRouter()

  return (
    <Container>
      <FlatList
        contentContainerStyle={{ flexDirection: 'column', gap: 12 }}
        data={encrypted}
        renderItem={({ item }) => (
          <Card
            key={item.id}
            onPress={() => navigation.push('/display?id=' + item.id)}
          >
            <Image source={logo} />
            <CardBody>
              <TextAndId text={item.name} id={item.id} />
              <Text style={{ fontWeight: 'bold' }}>{item.user}</Text>
            </CardBody>
          </Card>
        )}
      />
      <AddEncrypt />
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

const AddEncrypt = () => {
  return (
    <TouchableOpacity>
      <Link href={'/add'}>
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
      </Link>
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
