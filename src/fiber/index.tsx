import { TFiber, TReactElement } from "../interface";
import ReactDOM from '../react-dom';


export class Fiber implements TFiber{
  type: TReactElement.Type
  props: TReactElement.Props
  dom: Element= null
  parent: TFiber
  sibling: TFiber
  constructor(element: TReactElement.Jsx, parent: TFiber, preSibling?: TFiber) {
    this.type = element.type
    this.props = element.props
    this.parent = parent
    if(preSibling){
      preSibling.sibling= this
    }
  }
}


export function performUnitOfWork(fiber: TFiber): TFiber {
  // TODO add dom node
  if (!fiber.dom) {
    fiber.dom= ReactDOM.createDom(fiber)
  }
  // TODO create new fibers
  const { children }= fiber.props
  let preFiber: TFiber
  for(let i= 0; i < children.length; i++){
    preFiber= new Fiber(children[i], fiber, preFiber)
    if(i === 0){ fiber.child= preFiber }
  }
  // TODO return next unit of work
  if(fiber.child){
    return fiber.child
  }
  let nextFiber= fiber
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber= nextFiber.parent
  }
}