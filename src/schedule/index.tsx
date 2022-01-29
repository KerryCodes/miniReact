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
const taskStore: any={
  nextTask: null,
}


const channel= new MessageChannel()
channel.port1.onmessage= e => {
  startTime= performance.now()
  const hasMoreWork= workLoop(deadline)
  if(hasMoreWork){ 
    requestAnimationFrame(schedulePerformWorkUntilDeadline)
  }
}
function schedulePerformWorkUntilDeadline(){
  channel.port2.postMessage(null)
}


function workLoop(deadline: IdleDeadline){
  while(!deadline.didTimeout && taskStore.nextTask){
    taskStore.nextTask= taskStore.nextTask()
  }
  return !!taskStore.nextTask
}


export function requestHostCallback(task: () => void) {
  taskStore.nextTask= task
  requestAnimationFrame(schedulePerformWorkUntilDeadline)
}