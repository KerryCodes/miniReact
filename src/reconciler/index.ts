import { commitRoot } from "../commit"
import diff from "../diff"
import { Fiber, rootFiberNode } from "../fiber"
import { reconcileChildren } from "../reconciliation"
import { isMessageLooping, requestScheduleIdleCallback } from "../schedule"


let workInProgress: Fiber = null


function startWorkSync(rootFiber: Fiber) {
  workInProgress = rootFiber
  workLoopSync()
}


function startWorkConcurrent(rootFiber: Fiber) {
  if (!isMessageLooping) {
    workInProgress= rootFiber
    requestScheduleIdleCallback(workLoopConcurrent)
  }
}


// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress= performUnitOfWork(workInProgress)
  }
  commitRoot(rootFiberNode.current)
}


// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent(deadline: IdleDeadline) {
  const shouldYield= () => deadline.timeRemaining() < 1
  while (workInProgress !== null && !shouldYield()) {
    workInProgress= performUnitOfWork(workInProgress)
  }
}


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


function updateFiber(fiber: Fiber): Fiber {
  // TODO create new fibers
  const { children } = fiber?.pendingProps || {}
  let preFiber: Fiber
  diff(fiber)
  for (let i = 0; i < children?.length; i++){
    const newFiber = new Fiber('FunctionComponent', children[i])
    newFiber.return= fiber
    if (i === 0) {
      fiber.child= newFiber
    } else {
      preFiber.sibling= newFiber
    }
    preFiber= newFiber
  }
  // TODO return next unit of work
  if(fiber?.child){ return fiber.child }
  let nexFiber= fiber
  while(nexFiber){
    if(nexFiber?.sibling){ return nexFiber.sibling }
    nexFiber= nexFiber.return
  }
  return null
}


export { workInProgress, startWorkSync, startWorkConcurrent, workLoopSync, workLoopConcurrent }