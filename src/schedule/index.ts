import commit from "../commit";
import { performUnitOfWork, rootFiberNode } from "../fiber";
import { TFiber } from "../interface";


const yieldInterval= 5
let startTime= 0
const deadline= {
  get didTimeout(){
    return this.getCurrentTime() - startTime >= yieldInterval
  },
  timeRemaining(){
    return yieldInterval - (this.getCurrentTime() - startTime)
  },
  getCurrentTime(){
    return performance.now()
  }
}
// const unitOfWorkQueue: TFiber[]= []
let nextUnitOfWork: TFiber= null
let hostCallback: (deadline: IdleDeadline) => boolean = null
let isMessageLooping= false

const channel = new MessageChannel()
const schedulePerformWorkUntilDeadline= () => channel.port2.postMessage(null)

channel.port1.onmessage = e => {
  startTime= performance.now()
  const hasMoreWork = hostCallback(deadline)
  if (hasMoreWork) {
    requestScheduleIdleCallback(workLoop)
  } else {
    isMessageLooping = false
    commit.startCommitWork()
  }
  console.log('new');
}


function requestScheduleIdleCallback(workLoop: (deadline: IdleDeadline) => boolean){
  hostCallback= workLoop
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}


function workLoop(deadline: IdleDeadline): boolean{
  let shouldYield = false
  while(nextUnitOfWork && !shouldYield){
    nextUnitOfWork= performUnitOfWork(nextUnitOfWork)
    shouldYield= deadline.timeRemaining() < 1
  }
  return !!nextUnitOfWork
}


function startNextUnitOfWork(rootFiber: TFiber) {
  if (!isMessageLooping) {
    rootFiberNode.workInProgress= rootFiber
    nextUnitOfWork = rootFiber
    isMessageLooping = true
    requestScheduleIdleCallback(workLoop)
  }
}


export default { startNextUnitOfWork }