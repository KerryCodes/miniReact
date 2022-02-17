import { Fiber, rootFiberNode } from "../fiber";
import { TNode, TReactElement } from "../interface";
import schedule from '../schedule';


function createDom(fiber: Fiber | TReactElement.Jsx) {
  //@ts-ignore
  const { type, pendingProps, props }= fiber
  const { children, ...attributes }= pendingProps || props
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


function render(element: TReactElement.Jsx, rootNode: Element){
  const rootFiber = new Fiber(element)
  rootFiberNode.rootNode = rootNode
  schedule.startWorkSync(rootFiber)
}


function createRoot(rootNode: Element){
  return {
    render(element: TReactElement.Jsx) {
      const rootFiber = new Fiber(element)
      rootFiberNode.rootNode = rootNode
      schedule.startWorkConcurrent(rootFiber)
    }
  }
}


export default { createDom, render, createRoot }