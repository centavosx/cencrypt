import { Redirect, useRouter } from 'expo-router'
import { Formik } from 'formik'
import React, { useContext, useMemo, useState } from 'react'
import { View, SafeAreaView, Image, Text } from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { StyledInput } from '../components/StyledInput'
import { useAppDispatch } from '../redux/dispatch'

import {
  changePassword,
  selectPassword,
  addTries,
  resetTries,
  selectNumberOfTries,
} from '../redux/slices/passwordSlice'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { compare, hashValue } from '../lib'
import { UserContext } from '../context/user.context'

type PasswordProps = {
  password: string
  confirm: string
}

export default function InAppScreen() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext)
  const dispatch = useAppDispatch()
  const password = useSelector(selectPassword)
  const tries = useSelector(selectNumberOfTries)
  const [display, setDisplay] = useState(false)
  const [displayConfirm, setDisplayConfirm] = useState(false)

  const PasswordSchema = useMemo(
    () =>
      Yup.object().shape(
        !password
          ? {
              password: Yup.string().trim().min(8).required('Required'),
              confirm: Yup.string()
                .min(8)
                .oneOf([Yup.ref('password'), ''], 'Passwords must match')
                .required('Required'),
            }
          : {
              password: Yup.string().test({
                name: 'checkPassword',
                test: async function (value) {
                  if (value && value.length > 0) {
                    const check = compare(value, password)
                    if (!check) {
                      dispatch(addTries(1))
                      return this.createError({
                        message: 'Password is invalid',
                        path: 'password',
                      })
                    }
                  }
                  return true
                },
              }),
            }
      ),
    [password]
  )
  if (isLoggedIn) return <Redirect href={'/home'} />

  return (
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
        Enter In App Password
      </Text>
      {!!tries && (
        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 8,
            color: 'red',
            textTransform: 'uppercase',
          }}
        >
          Number of tries: {tries}, Maximum:3
        </Text>
      )}
      <Body>
        {!!password ? (
          <Formik<{ password: string }>
            initialValues={{ password: '' }}
            onSubmit={async (_, { setSubmitting }) => {
              setSubmitting(true)
              dispatch(resetTries())
              setIsLoggedIn(true)
              setSubmitting(false)
            }}
            validateOnChange={false}
            validationSchema={PasswordSchema}
          >
            {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
              <>
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
                  value={values.password}
                  onChangeText={(v) => setFieldValue('password', v)}
                  onClickRight={() => setDisplay((v) => !v)}
                  error={errors.password}
                />
                <StyledButton
                  variant="primary"
                  style={{ width: 80, alignSelf: 'flex-end' }}
                  disabled={isSubmitting}
                  onPress={() => submitForm()}
                >
                  Next
                </StyledButton>
              </>
            )}
          </Formik>
        ) : (
          <Formik<PasswordProps>
            initialValues={{ password: '', confirm: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true)
              const hashedValue = hashValue(values.password)
              dispatch(resetTries())
              dispatch(changePassword(hashedValue))
              setIsLoggedIn(true)
              setSubmitting(false)
            }}
            validateOnChange={true}
            validationSchema={PasswordSchema}
          >
            {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
              <>
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
                <StyledButton
                  variant="primary"
                  style={{ width: 80, alignSelf: 'flex-end' }}
                  onPress={() => submitForm()}
                  disabled={isSubmitting}
                >
                  Next
                </StyledButton>
              </>
            )}
          </Formik>
        )}
      </Body>
    </Container>
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
