import { Fiber, rootFiberNode } from '../fiber';
import { TNode } from '../interface';
import ReactDOM from '../react-dom';


function commitRoot(rootFiber: Fiber) {
  if (rootFiber.alternate === null) {
    const domTree = commitWork(rootFiber.child)
    rootFiber.stateNode.appendChild(domTree)//只有首次渲染需要
    rootFiberNode.current.alternate = rootFiber
  }
  console.log('rootFiberNode:', rootFiberNode)
}


function commitWork(fiber: Fiber): TNode {
  if (!fiber) { return }
  fiber.stateNode = ReactDOM.createDom(fiber)
  // switch (fiber.effectTag) {
  //   case 'PLACEMENT':
  //     fiber.stateNode = ReactDOM.createDom(fiber)
  //     break;
  //   case "UPDATE":
  //     break;
  // }
  fiber.return?.stateNode.appendChild(fiber.stateNode)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
  return fiber.stateNode
}


export { commitRoot }