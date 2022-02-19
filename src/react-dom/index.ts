import { Fiber, rootFiberNode } from "../fiber";
import { TNode, TReactElement } from "../interface";
import { performConcurrentWorkOnRoot, performSyncWorkOnRoot } from "../renderer";


function createDom(fiber: Fiber | TReactElement.Jsx) {
  //@ts-ignore
  const { type, pendingProps, props }= fiber
  const { children, ...attributes }= pendingProps || props || {}
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

  Reflect.ownKeys(attributes).forEach(key => {
    //@ts-ignore
    dom[key]= attributes[key]
  })

  return dom
}


function render(element: TReactElement.Jsx, rootNode: Element, concurrent?: boolean){
  const rootFiber = new Fiber('HostComponent', {
    type: 'div',
    props: { children: [element] }
  })
  rootFiber.stateNode = rootNode
  //@ts-ignore
  rootFiberNode.current = {
    alternate: rootFiber,
  }
  if (concurrent) {
    performConcurrentWorkOnRoot(rootFiber)
  } else {
    performSyncWorkOnRoot(rootFiber)
  }
}


function createRoot(rootNode: Element){
  return {
    render(element: TReactElement.Jsx) {
      render(element, rootNode, true)
    }
  }
}


export default { createDom, render, createRoot }