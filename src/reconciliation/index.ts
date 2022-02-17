import { deletions, Fiber, rootFiberNode } from "../fiber";
import { TEffect, TReactElement } from "../interface";


function reconcileChildren(current: Fiber | null, workInProgress: Fiber, nextChildren: any) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else {
    // 对于update的组件
    // workInProgress.child = reconcileChildFibers(
    //   workInProgress,
    //   current.child,
    //   nextChildren,
    // )
  }
}

function mountChildFibers(workInProgress: Fiber, currentChild: Fiber, nextChildren: any): Fiber {
  // TODO create new fibers
  const { children } = workInProgress?.pendingProps || {}
  let preFiber: Fiber
  let workInProgressChild: Fiber
  // diff(fiber)
  for (let i = 0; i < children?.length; i++){
    const newFiber = new Fiber('FunctionComponent', children[i])
    newFiber.return= workInProgress
    if (i === 0) {
      workInProgressChild= newFiber
    } else {
      preFiber.sibling= newFiber
    }
    preFiber= newFiber
  }
  return workInProgressChild
  // TODO return next unit of work
  // if(workInProgress?.child){ return workInProgress.child }
  // let nexFiber= workInProgress
  // while(nexFiber){
  //   if(nexFiber?.sibling){ return nexFiber.sibling }
  //   nexFiber= nexFiber.return
  // }
  // return null
}


function reconcileChildFibers(){}


export { reconcileChildren }