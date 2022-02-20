import { Fiber, rootFiberNode } from '../fiber';
import { TNode } from '../interface';
import ReactDOM from '../react-dom';


function commitRoot() {
  commitWork(rootFiberNode.rootFiberWorkInProgress.child)
  rootFiberNode.current = rootFiberNode.rootFiberWorkInProgress
  rootFiberNode.rootFiberWorkInProgress= null
  console.log('rootFiberNode:', rootFiberNode)
}


function commitWork(fiber: Fiber | null): TNode | null {
  if (fiber === null) { return null }
  switch (fiber.effectTag) {
    case 'PLACEMENT':
      let parentFiber = fiber.return
      while (!parentFiber.stateNode) {
        parentFiber= parentFiber.return
      }
      fiber.stateNode = ReactDOM.createDom(fiber)
      parentFiber.stateNode.appendChild(fiber.stateNode)
      break;
    case "UPDATE":
      ReactDOM.updateDom(fiber.alternate, fiber)
      break;
  }
  fiber.effectTag= null
  commitWork(fiber.child)
  commitWork(fiber.sibling)
  return fiber.stateNode
}


export { commitRoot }