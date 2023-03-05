import { ReactNode } from 'react'

import { Animated, StyleProp, ViewStyle } from 'react-native'

import { Swipeable } from 'react-native-gesture-handler'

export interface SwipeableComponentProps {
  enableTrackpadTwoFingerGesture?: boolean

  friction?: number

  leftThreshold?: number

  rightThreshold?: number

  overshootLeft?: boolean

  overshootRight?: boolean

  overshootFriction?: number

  onSwipeableLeftOpen?: (ref: Swipeable | null) => void

  onSwipeableRightOpen?: (ref: Swipeable | null) => void

  onSwipeableOpen?: (ref: Swipeable | null) => void

  onSwipeableClose?: (ref: Swipeable | null) => void

  onSwipeableLeftWillOpen?: (ref: Swipeable | null) => void

  onSwipeableRightWillOpen?: (ref: Swipeable | null) => void

  onSwipeableWillOpen?: (ref: Swipeable | null) => void

  onSwipeableWillClose?: (ref: Swipeable | null) => void

  renderLeftActions?: (
    progressAnimatedValue: Animated.AnimatedInterpolation<any>,

    dragAnimatedValue: Animated.AnimatedInterpolation<any>
  ) => React.ReactNode

  renderRightActions?: (
    progressAnimatedValue: Animated.AnimatedInterpolation<any>,

    dragAnimatedValue: Animated.AnimatedInterpolation<any>
  ) => React.ReactNode

  useNativeAnimations?: boolean

  animationOptions?: Record<string, unknown>

  containerStyle?: StyleProp<ViewStyle>

  childrenContainerStyle?: StyleProp<ViewStyle>

  children: ReactNode
}
