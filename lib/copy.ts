import Clipboard from '@react-native-clipboard/clipboard'
import Toast from 'react-native-simple-toast'

export const copyToClipboard = (text: string) => {
  Clipboard.setString(text)
  Toast.show('Copied password to clipbaord', Toast.SHORT)
}
