import { Fiber, rootFiberNode } from "../fiber"
import { recoverIndex } from "../hooks";
import { TReactElement } from "../interface";


let currentComponent: Fiber


function performUnitOfWork(workInProgress: Fiber) {
   return beginWork(workInProgress.alternate, workInProgress)
}


function beginWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  let didReceiveUpdate= true
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    // if (
    //   oldProps !== newProps ||
    //   hasLegacyContextChanged() ||
    //   (__DEV__ ? workInProgress.type !== current.type : false)
    // ) {
    //   didReceiveUpdate = true;
    // } else if (!includesSomeLane(renderLanes, updateLanes)) {
    //   didReceiveUpdate = false;
    //   switch (workInProgress.tag) {
    //     // 省略处理
    //   }
    //   // 复用current
    //   return bailoutOnAlreadyFinishedWork(
    //     current,
    //     workInProgress,
    //     renderLanes,
    //   );
    // } else {
    //   didReceiveUpdate = false;
    // }
  } else {
    didReceiveUpdate = false
  }
  
  let nextChildren = workInProgress.pendingProps.children.flat()
  // monet: 根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case 'HostRoot':
    case 'HostComponent':
      reconcileChildren(current, workInProgress, nextChildren)
      break;
    case 'FunctionComponent':
      currentComponent= workInProgress
      //@ts-ignore
      nextChildren = [workInProgress.type(workInProgress.pendingProps)].flat()
      reconcileChildren(current, workInProgress, nextChildren)
      recoverIndex()
      break;
    case 'ClassComponent':
      //略
      break;
    default:
      reconcileChildren(current, workInProgress, nextChildren)
  }
  if (workInProgress.child === null) {
    return completeWork(current, workInProgress)
  } else {
    return workInProgress.child
  }
}


function completeWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  // const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case 'HostRoot':
      return null
    case 'HostComponent':
      popHostContext(workInProgress);
      const rootContainerInstance = getRootHostContainer()
      const type = workInProgress.type
      if (current !== null && workInProgress.stateNode != null) {
        // update的情况
        // ...省略
      } else {
        // mount的情况
        // ...省略
      }
    case 'FunctionComponent':
      break;
    case 'ClassComponent':
      break;
    default:
      break;
  }
  if (workInProgress.sibling) {
    return workInProgress.sibling
  } else {
    const parent= workInProgress.return
    return completeWork(parent.alternate, parent)
  }
}

function popHostContext(workInProgress: Fiber) { }

function getRootHostContainer(){}


function bailoutOnAlreadyFinishedWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  return null
}


function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: TReactElement.Jsx[],
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(workInProgress, nextChildren)
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(workInProgress, current?.child, nextChildren)
  }
}


function mountChildFibers(
  workInProgress: Fiber,
  nextChildren: TReactElement.Jsx[],
): Fiber | null {
  let preFiber: Fiber
  let workInProgressChild: Fiber = null

  for (let i = 0; i < nextChildren?.length; i++){
    const element= nextChildren[i]
    const tag= element.type instanceof Function ? 'FunctionComponent' : 'HostComponent'
    const newFiber = new Fiber(tag, element)
    if (tag !== 'FunctionComponent') {
      newFiber.effectTag= 'PLACEMENT'
    }
    newFiber.return= workInProgress
    if (i === 0) {
      workInProgressChild= newFiber
    } else {
      preFiber.sibling= newFiber
    }
    preFiber = newFiber
  }

  return workInProgressChild
}


function reconcileChildFibers(
  workInProgress: Fiber,
  currentFirstChild: Fiber | null,
  nextChildren: any
): Fiber | null {
  return workInProgress.child
}


export { performUnitOfWork, currentComponent }