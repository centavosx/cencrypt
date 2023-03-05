import React, { useRef } from 'react'

import { Swipeable } from 'react-native-gesture-handler'

import { SwipeableComponentProps } from '../types'

export const Swipe = ({
  children,

  onSwipeableLeftOpen,

  onSwipeableRightOpen,

  onSwipeableOpen,

  onSwipeableClose,

  onSwipeableLeftWillOpen,

  onSwipeableRightWillOpen,

  onSwipeableWillOpen,

  onSwipeableWillClose,

  ...other
}: SwipeableComponentProps) => {
  const ref = useRef<Swipeable>(null)

  return (
    <Swipeable
      ref={ref}
      onSwipeableRightOpen={() => onSwipeableRightOpen?.(ref.current)}
      onSwipeableLeftOpen={() => onSwipeableLeftOpen?.(ref.current)}
      onSwipeableOpen={() => onSwipeableOpen?.(ref.current)}
      onSwipeableClose={() => onSwipeableClose?.(ref.current)}
      onSwipeableLeftWillOpen={() => onSwipeableLeftWillOpen?.(ref.current)}
      onSwipeableRightWillOpen={() => onSwipeableRightWillOpen?.(ref.current)}
      onSwipeableWillOpen={() => onSwipeableWillOpen?.(ref.current)}
      onSwipeableWillClose={() => onSwipeableClose?.(ref.current)}
      {...other}
    >
      {children}
    </Swipeable>
  )
}
