import { Fiber, rootFiberNode } from "../fiber";
import { TNode, TReactElement } from "../interface";
import { performConcurrentWorkOnRoot, performSyncWorkOnRoot } from "../renderer";
import { isEvent } from "../utils";


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
    if (isEvent(key)) {
      dom.addEventListener(key.toLowerCase().substring(2), attributes[key])
    }
    //@ts-ignore
    dom[key]= attributes[key]
  })

  return dom
}


function updateDom(current: Fiber, workInProgress: Fiber): TNode {
  const { children, ...oldAttributes } = current.pendingProps
  const { children: newChildren, ...newAttributes } = workInProgress.pendingProps
  const dom = workInProgress.stateNode

  Object.keys(newAttributes).forEach(key => {
    if (isEvent(key)) {
      dom.addEventListener(key.toLowerCase().substring(2), newAttributes[key])
    }
    //@ts-ignore
    dom[key]= newAttributes[key]
  })

  return dom
}


function render(element: TReactElement.Jsx, rootNode: Element, concurrent?: boolean){
  const rootFiber = new Fiber('HostRoot', {
    type: 'div',
    props: { children: [element] },
  })
  rootFiber.stateNode = rootNode
  rootFiberNode.rootFiberWorkInProgress = rootFiber
  if (concurrent) {
    performConcurrentWorkOnRoot()
  } else {
    performSyncWorkOnRoot()
  }
}


function createRoot(rootNode: Element){
  return {
    render(element: TReactElement.Jsx) {
      render(element, rootNode, true)
    }
  }
}


export default { createDom, updateDom, render, createRoot }