import React from 'react'
import { Formik } from 'formik'
import { useState } from 'react'
import { View, SafeAreaView, Image, Text } from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { StyledInput } from '../components/StyledInput'
import { useAppDispatch } from '../redux/dispatch'
import { v4 as uuidv4 } from 'uuid'
import { addEncrypt } from '../redux/slices/enrpytionsSlice'
import * as Yup from 'yup'
import { encryptText } from '../lib'
import { EncrpytState } from '../redux/slices/enrpytionsSlice'
import { useRouter } from 'expo-router'

const EncryptSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
  user: Yup.string().trim().required('Required'),
  value: Yup.string().trim().required('Required'),
  key: Yup.string().trim().required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('key')], 'Passwords must match')
    .required('Required'),
})

export default function AddEncryptScreen() {
  const { back } = useRouter()
  const dispatch = useAppDispatch()
  const [display, setDisplay] = useState(false)
  const [display2, setDisplay2] = useState(false)
  const [display3, setDisplay3] = useState(false)
  return (
    <Container>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        Add new encryption
      </Text>
      <Body>
        <Formik<EncrpytState & { key: string; confirm: string }>
          initialValues={{
            id: uuidv4(),
            user: '',
            name: '',
            value: '',
            key: '',
            confirm: '',
          }}
          validationSchema={EncryptSchema}
          onSubmit={async (
            { id, name, user, value, key },
            { setSubmitting }
          ) => {
            const newValue: EncrpytState = {
              id,
              user,
              name,
              value: encryptText(value, key),
            }
            setSubmitting(true)
            dispatch(addEncrypt(newValue))
            back()
            setSubmitting(false)
          }}
          validateOnChange={true}
        >
          {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
            <>
              <StyledInput
                label="Id"
                value={values.id}
                onChangeText={(v) => setFieldValue('key', v)}
                editable={false}
              />
              <StyledInput
                label="Name"
                placeholder="Type name of value to encrpyt"
                value={values.name}
                onChangeText={(v) => setFieldValue('name', v)}
                error={errors.name}
              />
              <StyledInput
                label="User"
                placeholder="Type user"
                value={values.user}
                onChangeText={(v) => setFieldValue('user', v)}
                error={errors.user}
              />
              <StyledInput
                label="Value to encrypt"
                placeholder="Type value to encrypt"
                secureTextEntry={!display3}
                rightIcon={
                  <Image
                    source={display3 ? eyeHidden : eyeVisible}
                    style={{ height: 18, width: 18, alignSelf: 'center' }}
                  />
                }
                value={values.value}
                onChangeText={(v) => setFieldValue('value', v)}
                onClickRight={() => setDisplay3((v) => !v)}
                error={errors.value}
              />
              <StyledInput
                label="Pass Key"
                placeholder="Enter Pass Key"
                secureTextEntry={!display}
                rightIcon={
                  <Image
                    source={display ? eyeHidden : eyeVisible}
                    style={{ height: 18, width: 18, alignSelf: 'center' }}
                  />
                }
                value={values.key}
                onChangeText={(v) => setFieldValue('key', v)}
                onClickRight={() => setDisplay((v) => !v)}
                error={errors.key}
              />
              <StyledInput
                label="Confirm"
                placeholder="Confirm your password"
                secureTextEntry={!display2}
                rightIcon={
                  <Image
                    source={display2 ? eyeHidden : eyeVisible}
                    style={{ height: 18, width: 18, alignSelf: 'center' }}
                  />
                }
                value={values.confirm}
                onChangeText={(v) => setFieldValue('confirm', v)}
                onClickRight={() => setDisplay2((v) => !v)}
                error={errors.confirm}
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
