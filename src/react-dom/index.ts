import { Fiber, rootFiberNode } from "../fiber";
import { TFiber, TNode, TReactElement } from "../interface";
import schedule from '../schedule';


function render(reactElement: TReactElement.Jsx, rootNode: TNode){
  const dom= createDom(reactElement)
  reactElement.props.children.map(item => render(item, dom))
  rootNode.appendChild(dom)
}


function createDom(fiber: TFiber | TReactElement.Jsx) {
  const { type, props }= fiber
  const { children, ...attributes }= props
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


function createRoot(rootNode: Element){
  return {
    render(element: TReactElement.Jsx){
      concurrentRender(element, rootNode)
    }
  }
}


function concurrentRender(element: TReactElement.Jsx, rootNode: Element) {
  //@ts-ignore
  const rootFiber= new Fiber(element, rootFiberNode)
  rootFiberNode.dom = rootNode
  schedule.startNextUnitOfWork(rootFiber)
}


export default { render, createDom, createRoot }