import commit from "../commit";
import { Fiber, rootFiberNode, updateFiber } from "../fiber";


const YIELDINTERVAL= 5
let startTime= 0
const deadline= {
  get didTimeout(){
    return this.getCurrentTime() - startTime >= YIELDINTERVAL
  },
  timeRemaining(){
    return YIELDINTERVAL - (this.getCurrentTime() - startTime)
  },
  getCurrentTime(){
    return performance.now()
  }
}
let workInProgress: Fiber = null
let hostCallback: (deadline: IdleDeadline) => void
let isMessageLooping = false

const channel = new MessageChannel()
const schedulePerformWorkUntilDeadline= () => channel.port2.postMessage(null)

channel.port1.onmessage = e => {
  startTime= performance.now()
  hostCallback(deadline)
  console.log('after schedulePerformWork, timeRemaining:', deadline.timeRemaining())
  if (workInProgress) {
    requestScheduleIdleCallback(workLoopConcurrent)
  } else {
    isMessageLooping = false
    commit.startCommitWork()
  }
}


function requestScheduleIdleCallback(workLoopConcurrent: (deadline: IdleDeadline) => void){
  hostCallback= workLoopConcurrent
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}


// performSyncWorkOnRoot会调用该方法
// function workLoopSync() {
//   while (workInProgress !== null) {
//     performUnitOfWork(workInProgress);
//   }
// }

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent(deadline: IdleDeadline){
  let shouldYield = false
  while (workInProgress !== null && !shouldYield) {
    performUnitOfWork(workInProgress)
    shouldYield= deadline.timeRemaining() < 1
  }
}


function performUnitOfWork(workInProgressFiber: Fiber) {
  workInProgress= updateFiber(workInProgressFiber)
}


function startWork(rootFiber: Fiber) {
  if (!isMessageLooping) {
    rootFiberNode.workInProgress= rootFiber
    workInProgress= rootFiber
    isMessageLooping = true
    requestScheduleIdleCallback(workLoopConcurrent)
  }
}


export default { startWork }