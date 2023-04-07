import { Formik, FormikProps } from 'formik'

import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { StyledInput } from '../components/StyledInput'

import * as Yup from 'yup'

import { useApi } from '../hooks'
import { login, LoginDto } from '../api'
import { Token } from '../entities'
import { useUser } from './_layout'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

const LoginSchema = Yup.object().shape({
  email: Yup.string().trim().email().required('Required'),
})

export default function LoginScreen() {
  const ref = useRef<FormikProps<LoginDto>>(null)
  const { back, replace } = useRouter()
  const { refetch: relogin, user } = useUser()
  const {
    refetch: post,
    data,
    isFetching,
    error,
  } = useApi<Token, LoginDto>(login, true)
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    const loginUser = async (accessToken: string, refreshToken: string) => {
      await AsyncStorage.setItem('accessToken', accessToken)
      await AsyncStorage.setItem('refreshToken', refreshToken)
      relogin()
    }

    if (!!data) {
      alert('Login Success')
      loginUser(data.accessToken, data.refreshToken)
    }

    if (!!error) {
      alert('Login failed')
    }

    if (!isFetching) {
      ref.current?.setSubmitting(false)
    }
  }, [isFetching, data, relogin, error])

  useEffect(() => {
    if (!!user) {
      back()
    }
  }, [user])

  return (
    <ScrollView style={{ backgroundColor: '#D9D9D9' }}>
      <Container>
        <ImageContainer>
          <Image
            source={require('../assets/logo/favicon.png')}
            style={{ height: 180, width: 180 }}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cencrypt</Text>
        </ImageContainer>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          Login
        </Text>

        <Body>
          <Formik<LoginDto>
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true)
              post(values)
            }}
            innerRef={ref}
            validateOnChange={true}
            validationSchema={LoginSchema}
          >
            {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
              <>
                <StyledInput
                  label="Email"
                  placeholder="Enter email"
                  value={values?.email}
                  onChangeText={(v) => setFieldValue('email', v)}
                  error={errors?.email}
                />
                <StyledInput
                  label="Confirm"
                  placeholder="Confirm your password"
                  secureTextEntry={!display}
                  rightIcon={
                    <Image
                      source={!display ? eyeVisible : eyeHidden}
                      style={{ height: 18, width: 18, alignSelf: 'center' }}
                    />
                  }
                  value={values?.password}
                  onChangeText={(v) => setFieldValue('password', v)}
                  onClickRight={() => setDisplay((v) => !v)}
                  error={errors?.password}
                />
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                    }}
                  >
                    No account?
                  </Text>
                  <TouchableOpacity onPress={() => replace('/register')}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontSize: 12,
                      }}
                    >
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
                <StyledButton
                  variant="primary"
                  style={{ width: 80, alignSelf: 'flex-end' }}
                  onPress={() => submitForm()}
                  disabled={isSubmitting}
                >
                  Login
                </StyledButton>
              </>
            )}
          </Formik>
        </Body>
      </Container>
    </ScrollView>
  )
}

const Container = styled(SafeAreaView)({
  background: '#D9D9D9',
  height: '100%',
  padding: 24,
})
const Body = styled(View)({
  flexDirection: 'column',
  flex: 1,
  gap: 8,
})

const ImageContainer = styled(View)({
  padding: 14,
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})
