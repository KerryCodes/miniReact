import diff from "../diff";
import { TFiber, TReactElement, TRootFiberNode } from "../interface";


const rootFiberNode: TRootFiberNode = {
  dom: null,
  current: null,
  workInProgress: null,
  firstEffect: null,
  currentEffect: null,
}

const deletions: TFiber[]= []


class Fiber implements TFiber{
  type: TReactElement.Type
  props: TReactElement.Props
  dom: Element= null
  parent: TFiber
  sibling: TFiber
  alternate: TFiber
  effectTag: "UPDATE" | "PLACEMENT" | "DELETION"
  constructor(element: TReactElement.Jsx, parent: TFiber, preSibling?: TFiber) {
    this.type = element.type
    this.props = element.props
    this.parent = parent
    if(preSibling){ preSibling.sibling= this }
    this.alternate = parent.alternate?.child
  }
}


function performUnitOfWork(fiber: TFiber): TFiber {
  // TODO create new fibers
  const { children }= fiber.props
  let preFiber: TFiber
  diff(fiber)
  for(let i= 0; i < children.length; i++){
    preFiber= new Fiber(children[i], fiber, preFiber)
    diff(preFiber)
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


export { rootFiberNode, deletions, Fiber, performUnitOfWork }