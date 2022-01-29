import { TFiber } from "../interface";
import ReactDOM from '../react-dom';


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
    isMessageLooping= false
  }
  // console.log('new');
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


function performUnitOfWork(fiber: TFiber): TFiber {
  // TODO add dom node
  if (!fiber.dom) {
    fiber.dom= ReactDOM.createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // TODO create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }
  // TODO return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}


function startNextUnitOfWork(fiber: TFiber){
  nextUnitOfWork = fiber
  if (!isMessageLooping) {
    isMessageLooping = true
    requestScheduleIdleCallback(workLoop)
  }
}


export default { unitOfWorkQueue, startNextUnitOfWork }