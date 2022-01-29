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
let nextUnitOfWork: Function= null
let hostCallback: (deadline: IdleDeadline) => boolean = null
const channel= new MessageChannel()
channel.port1.onmessage= e => performWorkUntilDeadline()


function performWorkUntilDeadline(){
  startTime= performance.now()
  const hasMoreWork= hostCallback(deadline)
  requestScheduleIdleCallback(hostCallback)
}


function schedulePerformWorkUntilDeadline(){
  channel.port2.postMessage(null)
}


function workLoop(deadline: IdleDeadline){
  let shouldYield = false
  while(nextUnitOfWork && !shouldYield){
    nextUnitOfWork= nextUnitOfWork()
    shouldYield= deadline.timeRemaining() < 1
  }
  return !!nextUnitOfWork
}


function requestScheduleIdleCallback(workLoop: (deadline: IdleDeadline) => boolean){
  hostCallback= workLoop
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}


export function openConcurrentMode(){
  requestScheduleIdleCallback(workLoop)
}


export function startConcurrentWork(task: any){
  nextUnitOfWork= task
}