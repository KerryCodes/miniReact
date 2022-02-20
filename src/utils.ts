export function isEvent(keyName: string) {
  return keyName.startsWith('on')
}