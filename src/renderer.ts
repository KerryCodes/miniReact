import { commitRoot } from "./commitRoot"
import { Fiber, rootFiberNode } from "./fiber"
import { performUnitOfWork } from "./reconciler"
import { isMessageLooping, requestScheduleIdleCallback } from "./schedule"
import ReactDOM from './ReactDOM';


export let workInProgress: Fiber = null


function performSyncWorkOnRoot() {
  workLoopSync()
}


function performConcurrentWorkOnRoot() {
  if (!isMessageLooping) {
    requestScheduleIdleCallback(workLoopConcurrent)
  }
}


export function performWorkOnRoot(rootFiber?: Fiber) {
  if (rootFiber) {
    workInProgress = rootFiber
  } else {
    workInProgress = { ...rootFiberNode.current }
    workInProgress.alternate = rootFiberNode.current
    rootFiberNode.current.alternate = workInProgress
  }
  ReactDOM.isConcurrentMode ? performConcurrentWorkOnRoot() : performSyncWorkOnRoot()
}


// performSyncWorkOnRoot会调用该方法
export function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress= performUnitOfWork(workInProgress)
  }
  commitRoot()
}


// performConcurrentWorkOnRoot会调用该方法
export function workLoopConcurrent(deadline: IdleDeadline) {
  const shouldYield= () => deadline.timeRemaining() < 1
  while (workInProgress !== null && !shouldYield()) {
    workInProgress= performUnitOfWork(workInProgress)
  }
}