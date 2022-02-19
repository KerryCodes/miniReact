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
  if (fiber === null) {
    return null
  }
  switch (fiber.effectTag) {
    case 'PLACEMENT':
      let parentFiber= fiber.return
      fiber.stateNode = ReactDOM.createDom(fiber)
      if (fiber.stateNode) {
        while (!parentFiber.stateNode) {
          parentFiber= parentFiber.return
        }
        parentFiber.stateNode.appendChild(fiber.stateNode)
      }
      break;
    case "UPDATE":
      break;
  }
  fiber.effectTag= null
  commitWork(fiber.child)
  commitWork(fiber.sibling)
  return fiber.stateNode
}


export { commitRoot }