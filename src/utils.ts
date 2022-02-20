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


  // // 去除过期的属性
  // Object.keys(oldAttributes).forEach(key => {
  //   if (key in newAttributes) {
  //     return;
  //   } else {
  //     // removeStaleProperty(key, oldAttributes[key], dom)
  //   }
  // })

  // // 更新属性
  // Object.keys(newAttributes).forEach(key => {
  //   const newValue = oldAttributes[key]
  //   const oldValue = oldAttributes[key]
  //   if (isEvent(key)) {
  //     dom.addEventListener(transferEventName(key), newAttributes[key])
  //   } else if (newValue !== oldValue) {
  //     //@ts-ignore
  //     dom[key]= newValue
  //   }
  // })