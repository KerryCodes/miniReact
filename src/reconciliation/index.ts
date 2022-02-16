import { deletions, Fiber, rootFiberNode } from "../fiber";
import { TEffect, TReactElement } from "../interface";


function diff(newFiber: Fiber) {
  const oldFiber= newFiber.alternate
  if (!oldFiber) {
    newFiber.effectTag= "PLACEMENT"
  } else {
    if (newFiber.type !== oldFiber.type) {
      newFiber.effectTag= "PLACEMENT"
    }
    if (newFiber.type === oldFiber.type && newFiber.props !== oldFiber.props) {
      newFiber.effectTag= "UPDATE"
    }
    if (false) {
      newFiber.effectTag= "DELETION"
    }
  }


  const newEffect: TEffect= {
    fiber: newFiber,
    nextEffect: null,
  }
  if (!rootFiberNode.firstEffect) {
    rootFiberNode.firstEffect = newEffect
    rootFiberNode.currentEffect= newEffect
  } else {
    rootFiberNode.currentEffect.nextEffect = newEffect
    rootFiberNode.currentEffect= newEffect
  
  }
}


function reconcileChildFibers(currentFiber: Fiber, newChildren: TReactElement.Jsx[], workInProgressFiber: Fiber) {
  let index = 0
  let fiber = currentFiber.child
  let wipFiber= null
  
  while (fiber) {
    const newChild = newChildren[index]
    if (!newChild) {
      deletions.push(fiber)
    } else if (fiber.type === newChild.type) {
      wipFiber = fiber.alternate
      wipFiber.props.children= [newChild]
      wipFiber.effectTag= "UPDATE"
    } else {
      wipFiber= new Fiber(newChild, workInProgressFiber, wipFiber)
      wipFiber.effectTag = "PLACEMENT"
      fiber.alternate= wipFiber
    }
    index++
    fiber= fiber.sibling
  }
}


export { reconcileChildFibers }