import { reconcileChildrenArray, placeSingleChild, reconcileSingleTextNode } from "./diff";
import { Fiber, rootFiberNode } from "./fiber"
import { recoverIndex } from "./hooks";


export let currentlyRenderingFiber: Fiber


export function performUnitOfWork(workInProgress: Fiber) {
   return beginWork(workInProgress.alternate, workInProgress)
}


function beginWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  // let didReceiveUpdate = true
  let isCopyFiber= false
  currentlyRenderingFiber = workInProgress
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  // if (current !== null) {
  //   const oldProps = current.memoizedProps;
  //   const newProps = workInProgress.pendingProps;
  //   if (oldProps !== newProps || hasLegacyContextChanged()) {
  //     didReceiveUpdate = true
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
  //   } else {
  //     didReceiveUpdate = false
  //   }
  // } else {
  //   didReceiveUpdate = false
  // }

  if (!current?.updateQueue && current?.pendingProps === workInProgress.pendingProps) {
    isCopyFiber = true
    if (current.child) {
      workInProgress.child = { ...current.child }
      workInProgress.child.alternate = current.child
      current.child.alternate= workInProgress.child
    }
    let workInProgressSibling = workInProgress.child
    let currentSibling = current.child
    while (currentSibling?.sibling) {
      workInProgressSibling.sibling = { ...currentSibling.sibling }
      workInProgressSibling.sibling.alternate = currentSibling.sibling
      currentSibling.sibling.alternate= workInProgressSibling.sibling
      workInProgressSibling = workInProgressSibling.sibling 
      currentSibling = currentSibling.sibling 
    }
  }

  if (current === null || !isCopyFiber) {
    let nextChildren = workInProgress.pendingProps.children.flat()
    // monet: 根据tag不同，创建不同的子Fiber节点
    switch (workInProgress.tag) {
      case 'HostRoot':
      case 'HostComponent':
        reconcileChildren(current, workInProgress, nextChildren)
        break;
      case 'FunctionComponent':
        const Fc= workInProgress.type
        //@ts-ignore
        nextChildren = Fc(workInProgress.pendingProps)
        reconcileChildren(current, workInProgress, nextChildren)
        break;
      case 'ClassComponent':
        //略
        break;
      default:
        reconcileChildren(current, workInProgress, nextChildren)
    }
  }

  recoverIndex()
  if (workInProgress.child === null) {
    return completeWork(current, workInProgress)
  } else {
    return workInProgress.child
  }
}


function bailoutOnAlreadyFinishedWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  return null
}


function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: ReactElement.Jsx[] | ReactElement.Jsx
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(workInProgress, nextChildren)
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
  }
}


function mountChildFibers(
  workInProgress: Fiber,
  nextChildren: ReactElement.Jsx[] | ReactElement.Jsx
): Fiber | null {
  let preFiber: Fiber
  let workInProgressChild: Fiber = null
  const children= Array.isArray(nextChildren) ? nextChildren : [nextChildren]

  for (let i = 0; i < children.length; i++){
    const element= children[i]
    const tag= element.type instanceof Function ? 'FunctionComponent' : 'HostComponent'
    const newFiber = new Fiber(tag, element)
    newFiber.return = workInProgress
    newFiber.effectTag= tag === 'FunctionComponent' ? null : 'PLACEMENT'
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
  nextChildren: ReactElement.Jsx[] | ReactElement.Jsx
): Fiber | null {
  let currentFiber= currentFirstChild
  let preFiber: Fiber
  let workInProgressChild: Fiber = null
  const children= Array.isArray(nextChildren) ? nextChildren : [nextChildren]

  // if (Array.isArray(nextChildren)) {
  //   reconcileChildrenArray()
  // } else if (nextChildren.type === 'TEXT_ELEMENT') {
  //   reconcileSingleTextNode(currentFirstChild, nextChildren)
  // } else {
  //   placeSingleChild()
  // }

  // console.log(currentFiber);
  for (let i = 0; i < children.length; i++){
    let newFiber: Fiber
    const element= children[i]
    const tag = element.type instanceof Function ? 'FunctionComponent' : 'HostComponent'
    if (currentFiber.type === element.type) {
      const { key, ...pendingProps } = element.props
      newFiber = {
        ...currentFiber,
        pendingProps,
        alternate: currentFiber,
      }
      
      newFiber.effectTag= tag === 'HostComponent' ? 'UPDATE' : null
    } else {
      newFiber = new Fiber(tag, element) 
      newFiber.alternate = currentFiber
      newFiber.effectTag = 'PLACEMENT'
    }
    newFiber.return= workInProgress
    currentFiber.alternate= newFiber
    if (i === 0) {
      workInProgressChild= newFiber
    } else {
      preFiber.sibling= newFiber
    }
    preFiber = newFiber
    currentFiber= currentFiber.sibling
  }

  return workInProgressChild
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