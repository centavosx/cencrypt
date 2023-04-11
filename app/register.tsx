import { Formik, FormikProps } from 'formik'
import React, { useRef, useState } from 'react'
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { StyledInput } from '../components/StyledInput'

import * as Yup from 'yup'
import { useApi } from '../hooks'
import { register, RegisterDto } from '../api'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

type RegisterProps = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('Required'),
  lastName: Yup.string().trim().required('Required'),
  email: Yup.string().trim().email().required('Required'),
  password: Yup.string()
    .trim()
    .min(8)
    .matches(/[A-Z]/, 'Password should contain uppercase')
    .matches(/\d/, 'Password should contain numbers')
    .matches(/[a-z]/, 'Password should contain lowercase.')
    .required('Required'),
  confirm: Yup.string()
    .min(8)
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Required'),
})

export default function RegisterScreen() {
  const ref = useRef<FormikProps<RegisterProps>>(null)
  const {
    refetch: post,
    data,
    isFetching,
    error,
  } = useApi<any, RegisterDto>(register, true)
  const { replace } = useRouter()
  const [display, setDisplay] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)

  useEffect(() => {
    if (!isFetching) ref.current?.setSubmitting(false)
  }, [isFetching])

  useEffect(() => {
    if (!!data) {
      Alert.alert('Register', 'Register successful!!!')
      replace('/login')
    }
    if (!!error) {
      Alert.alert('Register', 'Register failed!!!')
    }
  }, [data, error])

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
          Register
        </Text>

        <Body>
          <Formik<RegisterProps>
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirm: '',
            }}
            innerRef={ref}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true)
              const newValues: Partial<RegisterProps> = { ...values }
              delete newValues.confirm
              post(newValues as RegisterDto)
            }}
            validateOnChange={true}
            validationSchema={RegisterSchema}
          >
            {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
              <>
                <StyledInput
                  label="First Name"
                  placeholder="Enter First Name"
                  value={values?.firstName}
                  onChangeText={(v) => setFieldValue('firstName', v)}
                  error={errors?.firstName}
                />
                <StyledInput
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={values?.lastName}
                  onChangeText={(v) => setFieldValue('lastName', v)}
                  error={errors?.lastName}
                />
                <StyledInput
                  label="Email"
                  placeholder="Enter email"
                  value={values?.email}
                  onChangeText={(v) => setFieldValue('email', v)}
                  error={errors?.email}
                />

                <StyledInput
                  label="Password"
                  placeholder="Enter password"
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
                <StyledInput
                  label="Confirm"
                  placeholder="Confirm your password"
                  secureTextEntry={!displayConfirm}
                  rightIcon={
                    <Image
                      source={!displayConfirm ? eyeVisible : eyeHidden}
                      style={{ height: 18, width: 18, alignSelf: 'center' }}
                    />
                  }
                  value={values?.confirm}
                  onChangeText={(v) => setFieldValue('confirm', v)}
                  onClickRight={() => setDisplayConfirm((v) => !v)}
                  error={errors?.confirm}
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
                    Have account?
                  </Text>
                  <TouchableOpacity onPress={() => replace('/login')}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontSize: 12,
                      }}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
                <StyledButton
                  variant="primary"
                  style={{ width: 80, alignSelf: 'flex-end' }}
                  onPress={() => submitForm()}
                  disabled={isSubmitting}
                >
                  Register
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
