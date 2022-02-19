import { commitRoot } from "../commit";
import { rootFiberNode } from "../fiber";
import { workInProgress, workLoopConcurrent } from "../renderer";


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
    commitRoot(rootFiberNode.current.alternate)
  }
}


function requestScheduleIdleCallback(workLoopConcurrent: (deadline: IdleDeadline) => void) {
  isMessageLooping = true
  hostCallback= workLoopConcurrent
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}


export { isMessageLooping, requestScheduleIdleCallback }