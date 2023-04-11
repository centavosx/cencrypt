import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, Link, Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
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
  syncEncrypted,
} from '../../redux/slices/enrpytionsSlice'
import { Swipe } from '../../components/Swipe'
import { Swipeable } from 'react-native-gesture-handler'
import { useAppDispatch } from '../../redux/dispatch'
import { useUser } from '../_layout'
import { useApi } from '../../hooks'
import { deleteData, getSyncedData, synchronize } from '../../api'
import { Protected } from '../../entities'
import { decryptText, encryptText } from '../../lib'
import { selectAccountSettings } from '../../redux/slices/accountSettingsSlice'
import { useIsFocused } from '@react-navigation/native'
import { StyledButton } from '../../components/StyledButton'

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
  const settings = useSelector(selectAccountSettings)
  const isFocused = useIsFocused()
  const [isAscending, setIsAscending] = useState(true)

  const { user } = useUser()
  const {
    refetch: post,
    data,
    isFetching,
    error,
  } = useApi<Protected[], Protected[]>(synchronize, true)

  const {
    refetch: refetchData,
    data: synced,
    isFetching: isGettingData,
  } = useApi<Protected[]>(getSyncedData, true)

  const { refetch: deletePassword, isFetching: isDeletingData } = useApi<
    Protected[]
  >(deleteData, true)

  const alertRemove = (
    id: string,
    swipe: Swipeable | null,
    dataId?: string | null
  ) => {
    Alert.alert(
      'Delete Password',
      'Are you sure to delete this password? Note: Once deleted it will never be retrieved again',
      [
        {
          text: 'Delete',
          onPress: () => {
            dispatch(encryptRemoveById(id))
            if (settings?.autoSync === true || settings?.autoSync === 'true')
              deletePassword(dataId)
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

  useEffect(() => {
    if (!!synced && !!user?.key && !!user?.id) {
      dispatch(
        syncEncrypted(
          synced.map((v) => ({
            dataId: v.id as string,
            name: v.name,
            user: v.userName,
            value: decryptText(v.value, user?.key) as string,
            uid: user.id,
          }))
        )
      )
    }
  }, [synced, dispatch])

  useEffect(() => {
    if (!!data || !!error) {
      refetchData()
    }
  }, [data, error, refetchData])

  const synchronizeData = () => {
    if (!isDeletingData && !!user?.key && !!user.id) {
      const filtered = encrypted
        .filter((v) => !v.dataId && v.uid !== user.id)
        .map((v) => ({
          id: v.dataId ?? undefined,
          name: v.name,
          userName: v.user,
          value: encryptText(v.value, user?.key),
        }))
      if (filtered.length === 0) {
        refetchData()
        return
      }
      post(filtered)
    }
  }

  useEffect(() => {
    if (
      (settings?.autoSync === true || settings?.autoSync === 'true') &&
      isFocused
    ) {
      synchronizeData()
    }
  }, [settings, isFocused])

  const sortedArray = useMemo(() => {
    const newArray = [...encrypted]

    newArray.sort((a, b) =>
      isAscending ? (a.name < b.name ? -1 : 1) : a.name > b.name ? -1 : 1
    )

    return newArray
  }, [encrypted, isAscending])

  return (
    <Container>
      <Tabs.Screen
        options={{
          headerRight: () =>
            !!user && (
              <TouchableOpacity
                onPress={synchronizeData}
                disabled={isFetching || isGettingData}
              >
                {isFetching || isGettingData || isDeletingData ? (
                  <Text>Loading</Text>
                ) : (
                  <Ionicons
                    name="sync-circle-outline"
                    color="black"
                    size={28}
                  />
                )}
              </TouchableOpacity>
            ),
        }}
      />

      {sortedArray.length === 0 ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            flex: 1,
          }}
        >
          <NoteText>
            You don't have any saved passwords, click [ + ] below to save one.
          </NoteText>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'column',
            gap: 8,
            flex: 1,
          }}
        >
          <StyledButton
            variant="secondary"
            style={{ width: 100, marginHorizontal: 24 }}
            onPress={() => setIsAscending((v) => !v)}
          >
            {isAscending ? 'Sort: A-Z' : 'Sort: Z-A'}
          </StyledButton>
          <FlatList
            contentContainerStyle={{
              flexDirection: 'column',
              gap: 12,
              paddingHorizontal: 24,
            }}
            data={sortedArray}
            renderItem={({ item }) => (
              <Swipe
                key={item.id}
                {...((isFetching || isGettingData || isDeletingData) &&
                !item.dataId
                  ? {}
                  : {
                      renderRightActions: renderRightActions,
                      onSwipeableRightOpen: (s) =>
                        alertRemove(item.id, s, item.dataId),
                    })}
              >
                <Card
                  onPress={
                    (isFetching || isGettingData || isDeletingData) &&
                    !item.dataId
                      ? undefined
                      : () => navigation.push('/display?id=' + item.id)
                  }
                >
                  <Image source={logo} />
                  <CardBody>
                    <TextAndId text={item.name} id={item?.dataId ?? ''} />
                    <Text style={{ fontWeight: 'bold' }}>{item.user}</Text>
                  </CardBody>
                </Card>
              </Swipe>
            )}
          />
        </View>
      )}
      <AddEncrypt />
    </Container>
  )
}

const TextAndId = ({ text, id }: { text: string; id: string }) => {
  return (
    <Text numberOfLines={1}>
      <Text style={{ fontWeight: 'bold' }}>{text}</Text>
      {!!id && ': '}
      <Text style={{ color: 'gray' }}>{id}</Text>
    </Text>
  )
}

const AddEncrypt = () => {
  return (
    <TouchableOpacity>
      <Link
        href={'/add'}
        style={{
          height: 80,
          width: 45,
          bottom: 0,
          zIndex: 1,
          right: 8,
          position: 'absolute',
        }}
      >
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 200,
            backgroundColor: 'black',
          }}
        >
          <Image
            source={add}
            style={{
              height: '100%',
              width: '100%',
              tintColor: 'white',
            }}
          />
        </View>
      </Link>
    </TouchableOpacity>
  )
}

const Container = styled(View)({
  paddingVertical: 24,
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
