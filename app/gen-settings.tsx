import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { View, ScrollView, Image, TextInputProps } from 'react-native'
import styled from 'styled-components/native'
import { eyeHidden, eyeVisible } from '../assets/icons'
import { StyledButton } from '../components/StyledButton'
import { OtherProps, StyledInput } from '../components/StyledInput'
import { useAppDispatch, useAppSelector } from '../redux/dispatch'

import { Formik } from 'formik'
import {
  GeneratorSettingsState,
  selectGenSettings,
  updateGenSettings,
} from '../redux/slices/genSettingsSlice'

import * as Yup from 'yup'

const GenSettingsSchema = Yup.object().shape({
  numberOfGenerated: Yup.number()
    .min(1, 'Minimum is 1')
    .max(15, 'Maximum is 15')
    .required('Required'),
})

const HideShowPassword = (
  props: TextInputProps &
    OtherProps & { unique: string; isNotPassword?: boolean }
) => {
  const [display, setDisplay] = useState(false)

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return (
    <StyledInput
      key={props.unique}
      {...props}
      placeholder="Random..."
      secureTextEntry={!display && mounted.current && !props.isNotPassword}
      rightIcon={
        !props.isNotPassword && (
          <Image
            source={display ? eyeHidden : eyeVisible}
            style={{ height: 18, width: 18, alignSelf: 'center' }}
          />
        )
      }
      onClickRight={() => setDisplay((v) => !v)}
    />
  )
}

export default function GenDisplayScreen() {
  const data = useAppSelector(selectGenSettings)
  const dispatch = useAppDispatch()

  return (
    <Container>
      <Formik<GeneratorSettingsState>
        initialValues={data}
        validationSchema={GenSettingsSchema}
        validateOnChange={true}
        onSubmit={(values) => {
          let newValue = {
            phrase1: !!values.phrase1 ? values.phrase1 : null,
            phrase2: !!values.phrase2 ? values.phrase2 : null,
            phrase3: !!values.phrase3 ? values.phrase3 : null,
            phrase4: !!values.phrase4 ? values.phrase4 : null,
            phrase5: !!values.phrase5 ? values.phrase5 : null,
            phrase6: isNaN(parseInt(values.phrase6?.toString() ?? ''))
              ? null
              : Number(values.phrase6),
            phrase7: isNaN(parseInt(values.phrase7?.toString() ?? ''))
              ? null
              : Number(values.phrase7),
            numberOfGenerated: isNaN(
              parseInt(values.numberOfGenerated?.toString() ?? '')
            )
              ? 1
              : Number(values.numberOfGenerated),
          }
          dispatch(updateGenSettings(newValue))
        }}
      >
        {({ setFieldValue, values, submitForm, errors }) => (
          <Body>
            {Object.keys(data).map((v, i) => (
              <HideShowPassword
                label={
                  v !== 'phrase6' &&
                  v !== 'phrase7' &&
                  v !== 'numberOfGenerated'
                    ? 'Word ' + (i + 1)
                    : v === 'phrase6' || v === 'phrase7'
                    ? 'Any number'
                    : 'Password count'
                }
                key={v}
                unique={v}
                value={values[v]?.toString() ?? undefined}
                keyboardType={
                  v === 'phrase6' ||
                  v === 'phrase7' ||
                  v === 'numberOfGenerated'
                    ? 'number-pad'
                    : undefined
                }
                isNotPassword={v === 'numberOfGenerated'}
                onChangeText={(value) => setFieldValue(v, value)}
                error={errors[v]}
              />
            ))}
            <StyledButton
              variant="primary"
              style={{ width: 120, alignSelf: 'flex-end' }}
              onPress={submitForm}
            >
              {'Save'}
            </StyledButton>
          </Body>
        )}
      </Formik>
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
