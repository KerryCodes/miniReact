import { commitRoot } from "../commit"
import { Fiber, rootFiberNode } from "../fiber"
import { performUnitOfWork } from "../reconciler"
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


export { workInProgress, startWorkSync, startWorkConcurrent, workLoopSync, workLoopConcurrent }