import { TFiber } from '../interface';
import { rootFiber } from '../react-dom';


function startCommitWork() {
  commitWork(rootFiber.child)
}


function commitWork(fiber: TFiber) {
  if(!fiber){ return }
  const parentDom = fiber.parent.dom
  parentDom.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}


export default { startCommitWork }