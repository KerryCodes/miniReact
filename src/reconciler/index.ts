import { Fiber } from "../fiber"


function performUnitOfWork(workInProgressFiber: Fiber) {
   return beginWork(workInProgressFiber.alternate, workInProgressFiber)
}


function beginWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  let didReceiveUpdate
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
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case 'HostComponent':
      const rootFiber = new Fiber('FunctionComponent', workInProgress.pendingProps.children[0])
      rootFiber.return= workInProgress
      workInProgress.child = rootFiber
      return workInProgress.child
    case 'FunctionComponent':
      reconcileChildren(current, workInProgress, null)
      if (workInProgress.child === null) {
        return completeWork(workInProgress.alternate, workInProgress)
      } else {
        return workInProgress.child
      }
      // return updateFiber(workInProgress)
    case 'ClassComponent':
      return;
  }
}


function completeWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  // const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
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
      return null
    case 'FunctionComponent':
      if (workInProgress.sibling) {
        return workInProgress.sibling
      } else {
        return completeWork(workInProgress.return.alternate, workInProgress.return)
      }
    case 'ClassComponent':
      return;
  }
}

function popHostContext(workInProgress: Fiber) { }

function getRootHostContainer(){}


function bailoutOnAlreadyFinishedWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  return null
}


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
  const { children } = workInProgress?.pendingProps || {}
  let preFiber: Fiber
  let workInProgressChild: Fiber = null
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
}


function reconcileChildFibers() {
  
}


export { performUnitOfWork }