import { commitRoot } from "../commit"
import { Fiber, rootFiberNode } from "../fiber"
import { performUnitOfWork } from "../reconciler"
import { isMessageLooping, requestScheduleIdleCallback } from "../schedule"
import ReactDOM from '../react-dom';


let workInProgress: Fiber = null


function performWorkOnRoot() {
  ReactDOM.isConcurrentMode ? performConcurrentWorkOnRoot() : performSyncWorkOnRoot()
}


function performSyncWorkOnRoot() {
  workInProgress = rootFiberNode.rootFiberWorkInProgress
  workLoopSync()
}


function performConcurrentWorkOnRoot() {
  if (!isMessageLooping) {
    workInProgress= rootFiberNode.rootFiberWorkInProgress
    requestScheduleIdleCallback(workLoopConcurrent)
  }
}


// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    workInProgress= performUnitOfWork(workInProgress)
  }
  commitRoot()
}


// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent(deadline: IdleDeadline) {
  const shouldYield= () => deadline.timeRemaining() < 1
  while (workInProgress !== null && !shouldYield()) {
    workInProgress= performUnitOfWork(workInProgress)
  }
}


export { workInProgress, performWorkOnRoot, workLoopSync, workLoopConcurrent }