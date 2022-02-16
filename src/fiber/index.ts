import diff from "../diff";
import { TNode, TReactElement, TRootFiberNode } from "../interface";


const rootFiberNode: TRootFiberNode = {
  rootNode: null,
  current: null,
  workInProgress: null,
  firstEffect: null,
  currentEffect: null,
}
const deletions: Fiber[]= []


class Fiber{
  // 作为静态数据结构的属性
  tag: 'Function' | 'Class' // Fiber对应组件的类型 Function/Class/Host...
  key: string | number // key属性
  elementType: TReactElement.Type // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  type: TReactElement.Type // 对于 FunctionComponent，指函数本身，对于ClassCompoent，指class，对于HostComponent，指DOM节点tagName
  stateNode: TNode // Fiber对应的真实DOM节点
  // 用于连接其他Fiber节点形成Fiber树
  return: Fiber = null
  child: Fiber = null
  sibling: Fiber = null
  index: number
  ref: any
  // 作为动态的工作单元的属性, 保存本次更新造成的状态改变相关信息
  pendingProps: any
  memoizedProps: any
  updateQueue: any
  memoizedState: any
  dependencies: any
  mode: any
  // 保存本次更新会造成的DOM操作
  effectTag: 'UPDATE' | 'PLACEMENT' | 'DELETION'
  nextEffect: any
  firstEffect: any
  lastEffect: any
  // 调度优先级相关
  lanes: any
  childLanes: any
  // 指向该fiber在另一次更新时对应的fiber
  alternate: Fiber
  constructor(
    element: TReactElement.Jsx,
    mode?: any
  ) {
    const { type, props } = element
    const { key, ...pendingProps } = props
    this.type= type
    this.key = key
    this.pendingProps = pendingProps
    this.tag = 'Function'
    this.mode= mode
  }
}


function updateFiber(fiber: Fiber): Fiber {
  // TODO create new fibers
  const { children } = fiber?.pendingProps || {}
  let preFiber: Fiber
  
  diff(fiber)
  for (let i = 0; i < children?.length; i++){
    const newFiber = new Fiber(children[i])
    newFiber.return= fiber
    if (i === 0) {
      fiber.child= newFiber
    } else {
      preFiber.sibling= newFiber
    }
    preFiber= newFiber
  }
  // TODO return next unit of work
  if(fiber?.child){ return fiber.child }
  let nexFiber= fiber
  while(nexFiber){
    if(nexFiber?.sibling){ return nexFiber.sibling }
    nexFiber= nexFiber.return
  }
  return null
}


export { rootFiberNode, deletions, Fiber, updateFiber }