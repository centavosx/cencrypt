import { Href } from 'expo-router/src/link/href'

export type Router = {
  /** Navigate to the provided href. */
  push: (href: Href) => void
  /** Navigate to route without appending to the history. */
  replace: (href: Href) => void
  /** Go back in the history. */
  back: () => void
  /** Update the current route query params. */
  setParams: (params?: Record<string, string>) => void
}
