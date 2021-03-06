import { commitRoot } from "./commitRoot";
import { workInProgress, workLoopConcurrent } from "./renderer";


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
export let isMessageLooping = false
let hostCallback: (deadline: IdleDeadline) => void

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
    commitRoot()
  }
}


export function requestScheduleIdleCallback(workLoopConcurrent: (deadline: IdleDeadline) => void) {
  isMessageLooping = true
  hostCallback= workLoopConcurrent
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}