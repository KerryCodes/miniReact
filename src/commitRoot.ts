import { Fiber, rootFiberNode } from './fiber';
import { TNode } from './interface';
import ReactDOM from './ReactDOM';


export function commitRoot() {
  const workInProgress= rootFiberNode.current.alternate.child
  commitWork(workInProgress)
  rootFiberNode.current = rootFiberNode.current.alternate
  console.log('rootFiberNode:', rootFiberNode)
}


function commitWork(workInProgress: Fiber | null): TNode | null {
  if (workInProgress === null) { return null }
  switch (workInProgress.effectTag) {
    case 'PLACEMENT':
      let parentFiber = workInProgress.return
      while (!parentFiber.stateNode) {
        parentFiber= parentFiber.return
      }
      workInProgress.stateNode = ReactDOM.createDom(workInProgress)
      parentFiber.stateNode.appendChild(workInProgress.stateNode)
      break;
    case "UPDATE":
      ReactDOM.updateDom(workInProgress.alternate, workInProgress)
      break;
  }
  workInProgress.effectTag= null
  commitWork(workInProgress.child)
  commitWork(workInProgress.sibling)
  return workInProgress.stateNode
}