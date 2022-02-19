import { Fiber, rootFiberNode } from '../fiber';
import { TNode } from '../interface';
import ReactDOM from '../react-dom';


function commitRoot(rootFiberWorkInProgress: Fiber) {
  if (rootFiberWorkInProgress.alternate === null) {
    const domTree = commitWork(rootFiberWorkInProgress.child)
    rootFiberWorkInProgress.stateNode.appendChild(domTree)//只有首次渲染需要
    rootFiberNode.current= rootFiberWorkInProgress
  }
  console.log('rootFiberNode:', rootFiberNode)
}


function commitWork(fiber: Fiber | null): TNode | null {
  if (fiber === null) {
    return null
  }
  switch (fiber.effectTag) {
    case 'PLACEMENT':
      fiber.stateNode = ReactDOM.createDom(fiber)
      break;
    case "UPDATE":
      break;
  }
  fiber.return.stateNode.appendChild(fiber.stateNode)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
  return fiber.stateNode
}


export { commitRoot }