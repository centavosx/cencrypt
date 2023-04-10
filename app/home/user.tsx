import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Text, View, ScrollView, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { StyledButton } from '../../components/StyledButton'
import { StyledInput } from '../../components/StyledInput'
import { useUser } from '../_layout'
import * as Yup from 'yup'
import { eyeHidden, eyeVisible } from '../../assets/icons'
import { Formik } from 'formik'
import {
  changePassword,
  resetTries,
  selectPassword,
} from '../../redux/slices/passwordSlice'
import { compare, hashValue } from '../../lib'
import { CheckBox } from '../../components/Checkbox'
import {
  selectAccountSettings,
  updateSettings,
} from '../../redux/slices/accountSettingsSlice'

const UserScreen = () => {
  return (
    <Container>
      <View
        style={{
          flexDirection: 'column',
          height: '100%',
          gap: 16,
          padding: 24,
        }}
      >
        <UserView />
        <AppSettings />
        <ChangePassword />
      </View>
    </Container>
  )
}

const AppSettings = () => {
  const settings = useSelector(selectAccountSettings)
  const dispatch = useDispatch()
  return (
    <>
      <View style={{ flexDirection: 'column' }}>
        <DualTextContainer>
          <WhiteText numberOfLines={1} style={{ flex: 1 }}>
            Auto Sync
          </WhiteText>
          <CheckBox
            size={24}
            value={settings.autoSync === true || settings.autoSync === 'true'}
            onChange={(v) =>
              dispatch(updateSettings({ ...settings, autoSync: v }))
            }
          />
        </DualTextContainer>
        <WhiteText
          style={{
            opacity: 0.5,
            flex: 1,
            fontSize: 12,
          }}
        >
          When set to true, the password manager will synchronize itself
          whenever a change is performed. (Logged in users only)
        </WhiteText>
      </View>
      <View style={{ flexDirection: 'column' }}>
        <DualTextContainer>
          <WhiteText numberOfLines={1} style={{ flex: 1 }}>
            Auto Delete
          </WhiteText>
          <CheckBox
            size={24}
            value={
              settings.autoDelete === true || settings.autoDelete === 'true'
            }
            onChange={(v) =>
              dispatch(updateSettings({ ...settings, autoDelete: v }))
            }
          />
        </DualTextContainer>
        <WhiteText
          style={{
            opacity: 0.5,
            flex: 1,
            fontSize: 12,
          }}
        >
          When set to true, each time the user logs in, all current passwords
          are removed.
        </WhiteText>
      </View>
    </>
  )
}

const PasswordSchema = Yup.object().shape({
  old: Yup.string().required('Required'),
  password: Yup.string().trim().min(8).required('Required'),
  confirm: Yup.string()
    .min(8)
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Required'),
})

const ChangePassword = () => {
  const dispatch = useDispatch()
  const password = useSelector(selectPassword)
  const [display, setDisplay] = useState(false)
  const [display1, setDisplay1] = useState(false)
  const [display2, setDisplay2] = useState(false)

  return (
    <View style={{ flexDirection: 'column', gap: 8 }}>
      <WhiteText style={{ fontSize: 16, fontWeight: '700' }}>
        Change App Password
      </WhiteText>
      <Formik
        initialValues={{ old: '', password: '', confirm: '' }}
        validationSchema={PasswordSchema}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          const check = compare(values.old, password!)
          if (!check) {
            alert('Wrong password')
            setSubmitting(false)
            return
          }
          const hashedValue = hashValue(values.password)
          dispatch(resetTries())
          dispatch(changePassword(hashedValue))
          alert('Password change successful!')
          setSubmitting(false)
        }}
      >
        {({ values, setFieldValue, errors, isSubmitting, submitForm }) => (
          <>
            <StyledInput
              label="Current Password"
              variant="secondary"
              placeholder="Enter current password"
              secureTextEntry={!display}
              rightIcon={
                <Image
                  source={!display ? eyeVisible : eyeHidden}
                  style={{ height: 18, width: 18, alignSelf: 'center' }}
                />
              }
              value={values.old}
              onChangeText={(v) => setFieldValue('old', v)}
              onClickRight={() => setDisplay((v) => !v)}
              error={errors.old}
            />
            <StyledInput
              label="New password"
              variant="secondary"
              placeholder="Enter new password"
              secureTextEntry={!display1}
              rightIcon={
                <Image
                  source={!display1 ? eyeVisible : eyeHidden}
                  style={{ height: 18, width: 18, alignSelf: 'center' }}
                />
              }
              value={values.password}
              onChangeText={(v) => setFieldValue('password', v)}
              onClickRight={() => setDisplay1((v) => !v)}
              error={errors.password}
            />
            <StyledInput
              label="Confirm Password"
              variant="secondary"
              placeholder="Enter confirm password"
              secureTextEntry={!display2}
              rightIcon={
                <Image
                  source={!display2 ? eyeVisible : eyeHidden}
                  style={{ height: 18, width: 18, alignSelf: 'center' }}
                />
              }
              value={values.confirm}
              onChangeText={(v) => setFieldValue('confirm', v)}
              onClickRight={() => setDisplay2((v) => !v)}
              error={errors.confirm}
            />
            <StyledButton
              variant="secondary"
              style={{ width: 80, alignSelf: 'flex-end' }}
              disabled={isSubmitting}
              onPress={() => submitForm()}
            >
              Submit
            </StyledButton>
          </>
        )}
      </Formik>
    </View>
  )
}

const UserView = () => {
  const { user } = useUser()

  return (
    <View style={{ gap: 2, width: '100%', flexDirection: 'column' }}>
      {!user ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <WhiteText style={{ flex: 1 }}>Not Logged In! </WhiteText>
        </View>
      ) : (
        <>
          <DualTextContainer>
            <WhiteText numberOfLines={1}>ID</WhiteText>
            <WhiteText
              numberOfLines={1}
              style={{ opacity: 0.5, textAlign: 'right', flex: 1 }}
            >
              {user.id}
            </WhiteText>
          </DualTextContainer>
          <DualTextContainer>
            <WhiteText numberOfLines={1}>First name</WhiteText>
            <WhiteText
              numberOfLines={1}
              style={{
                opacity: 0.5,
                textAlign: 'right',
                flex: 1,
              }}
            >
              {user.firstName}
            </WhiteText>
          </DualTextContainer>
          <DualTextContainer>
            <WhiteText numberOfLines={1}>Last name</WhiteText>
            <WhiteText
              numberOfLines={1}
              style={{ opacity: 0.5, textAlign: 'right', flex: 1 }}
            >
              {user.lastName}
            </WhiteText>
          </DualTextContainer>
          <DualTextContainer>
            <WhiteText numberOfLines={1}>Email</WhiteText>
            <WhiteText
              numberOfLines={1}
              style={{ opacity: 0.5, textAlign: 'right', flex: 1 }}
            >
              {user.email}
            </WhiteText>
          </DualTextContainer>
        </>
      )}
    </View>
  )
}

export default UserScreen

const WhiteText = styled(Text)({
  color: 'white',
})

const Container = styled(ScrollView)({
  background: 'black',
})

const DualTextContainer = styled(View)({
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
})
