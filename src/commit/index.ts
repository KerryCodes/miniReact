import { rootFiberNode } from '../fiber';
import { TFiber } from '../interface';
import ReactDOM from '../react-dom';


function startCommitWork() {
  commitWork(rootFiberNode.workInProgress)
  const { workInProgress } = rootFiberNode
  rootFiberNode.current = workInProgress
  rootFiberNode.current.alternate = workInProgress
  console.log('rootFiberNode:', rootFiberNode)
}


function commitWork(fiber: TFiber) {
  if (!fiber) { return }
  const {}= rootFiberNode
  switch (fiber.effectTag) {
    case 'PLACEMENT':
      fiber.dom = ReactDOM.createDom(fiber)
      break;
    case "UPDATE":
      break;
  }
  fiber.parent.dom.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


export default { startCommitWork }