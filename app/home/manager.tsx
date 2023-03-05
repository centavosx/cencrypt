import React from 'react'
import { useRouter, Link } from 'expo-router'

import {
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  View,
  Animated,
  Alert,
} from 'react-native'
import styled from 'styled-components/native'
import { add } from '../../assets/icons'
import { logo } from '../../assets/logo'
import { useSelector } from 'react-redux'
import {
  selectEncrypt,
  encryptRemoveById,
} from '../../redux/slices/enrpytionsSlice'
import { Swipe } from '../../components/Swipe'
import { Swipeable } from 'react-native-gesture-handler'
import { useAppDispatch } from '../../redux/dispatch'

const renderRightActions = (
  progress: Animated.AnimatedInterpolation<any>,
  dragX: Animated.AnimatedInterpolation<any>
) => {
  const opacity = dragX.interpolate({
    inputRange: [-150, 0.5],

    outputRange: [1, 0.1],
  })

  return (
    <SwipeView style={{ opacity }}>
      <TouchableOpacity>
        <Text>Delete</Text>
      </TouchableOpacity>
    </SwipeView>
  )
}

export default function PasswordScreen() {
  const encrypted = useSelector(selectEncrypt)
  const dispatch = useAppDispatch()
  const navigation = useRouter()

  const alertRemove = (id: string, swipe: Swipeable | null) => {
    Alert.alert(
      'Delete Password',
      'Are you sure to delete this password? Note: Once deleted it will never be retrieved again',
      [
        {
          text: 'Delete',
          onPress: () => {
            dispatch(encryptRemoveById(id))
            swipe?.close()
          },
        },
        {
          text: 'Cancel',
          onPress: () => swipe?.close(),
          style: 'cancel',
        },
      ]
    )
  }

  return (
    <Container>
      {encrypted.length === 0 ? (
        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
          <NoteText>
            You don't have any saved passwords, click [ + ] below to save one.
          </NoteText>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ flexDirection: 'column', gap: 12 }}
          data={encrypted}
          renderItem={({ item }) => (
            <Swipe
              key={item.id}
              renderRightActions={renderRightActions}
              onSwipeableRightOpen={(s) => alertRemove(item.id, s)}
            >
              <Card onPress={() => navigation.push('/display?id=' + item.id)}>
                <Image source={logo} />
                <CardBody>
                  <TextAndId text={item.name} id={item.id} />
                  <Text style={{ fontWeight: 'bold' }}>{item.user}</Text>
                </CardBody>
              </Card>
            </Swipe>
          )}
        />
      )}
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
    <Link
      href={'/add'}
      style={{
        height: 80,
        width: 45,
        bottom: 0,
        zIndex: 1,
        right: 2,
        position: 'absolute',
      }}
    >
      <Image
        source={add}
        style={{
          height: 45,
          width: 45,
          tintColor: 'white',
        }}
      />
    </Link>
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

const NoteText = styled(Text)({
  color: 'white',
  fontSize: 16,
  textAlign: 'center',
})

const SwipeView = styled(Animated.View)({
  position: 'relative',

  marginLeft: -5,

  height: '100%',

  marginTop: 1.5,

  marginBottom: 1.5,

  width: '50%',

  justifyContent: 'center',

  alignItems: 'center',

  borderTopRightRadius: 8,

  borderBottomRightRadius: 8,

  backgroundColor: 'red',
  color: 'white',
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
