import { TNode } from "./interface";


export function isEvent(keyName: string) {
  return keyName.startsWith('on')
}


export function transferEventName(key: string) {
  return key.toLowerCase().substring(2)
}


export function removeStaleProperty(keyName: string, value: any, dom: TNode) {
  if (isEvent(keyName)) {
    dom.removeEventListener(transferEventName(keyName), value)
  } else {
    //@ts-ignore
    dom[keyName]= ''
  }
}