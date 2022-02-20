import { Fiber, rootFiberNode } from "../fiber";
import { TNode, TReactElement } from "../interface";
import { performWorkOnRoot } from "../renderer";
import { isEvent, removeStaleProperty, transferEventName } from "../utils";


let isConcurrentMode= false


function createDom(fiber: Fiber): TNode {
  const { type, pendingProps }= fiber
  const { children, ...attributes }= pendingProps
  let dom: TNode

  switch(type){
    case 'TEXT_ELEMENT':
      dom= document.createTextNode('')
      break;
    case 'Fragment':
      dom= document.createDocumentFragment()
      break;
    default:
      dom= document.createElement(type as string)
  }

  Object.keys(attributes).forEach(key => {
    const value= attributes[key]
    if (isEvent(key)) {
      dom.addEventListener(transferEventName(key), value)
    } else {
      //@ts-ignore
      dom[key]= value
    }
  })

  return dom
}


function updateDom(current: Fiber, workInProgress: Fiber): TNode {
  const { children, ...oldAttributes } = current.pendingProps
  const { children: newChildren, ...newAttributes } = workInProgress.pendingProps
  const dom = workInProgress.stateNode

  // 去除过期的属性
  Object.keys(oldAttributes).forEach(key => {
    if (key in newAttributes) {
      return;
    } else {
      removeStaleProperty(key, oldAttributes[key], dom)
    }
  })

  // 更新属性
  Object.keys(newAttributes).forEach(key => {
    const newValue = newAttributes[key]
    const oldValue = oldAttributes[key]
    if (isEvent(key)) {
      newValue !== oldValue && dom.addEventListener(transferEventName(key), newValue)
    } else if (newValue !== oldValue) {
      //@ts-ignore
      dom[key]= newValue
    }
  })

  return dom
}


function render(element: TReactElement.Jsx, rootNode: Element, concurrent: boolean = false){
  const rootFiber = new Fiber('HostRoot', {
    type: 'div',
    props: { children: [element] },
  })
  rootFiber.stateNode = rootNode
  rootFiberNode.rootFiberWorkInProgress = rootFiber
  isConcurrentMode= concurrent
  performWorkOnRoot()
}


function createRoot(rootNode: Element){
  return {
    render(element: TReactElement.Jsx) {
      render(element, rootNode, true)
    }
  }
}


export default { isConcurrentMode, createDom, updateDom, render, createRoot }