import { rootFiberNode } from "../fiber";
import { TEffect, TFiber } from "../interface";


function diff(newFiber: TFiber) {
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


export default diff