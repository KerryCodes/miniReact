import diff from "../diff";
import { TNode, TReactElement, TRootFiberNode } from "../interface";
import { reconcileChildren } from "../reconciliation";


const rootFiberNode: TRootFiberNode = {
  current: null,
  firstEffect: null,
  currentEffect: null,
}
const deletions: Fiber[]= []


class Fiber{
  // 作为静态数据结构的属性
  tag: 'FunctionComponent' | 'ClassComponent' | 'HostComponent' // Fiber对应组件的类型 Function/Class/Host...
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
  alternate: Fiber = null
  constructor(
    tag: 'FunctionComponent' | 'ClassComponent' | 'HostComponent',
    element: TReactElement.Jsx,
    mode?: any
  ) {
    if (tag === 'HostComponent') {
      this.tag = tag
      this.child = new Fiber('FunctionComponent', element)
    } else {
      const { type, props } = element
      const { key, ...pendingProps } = props
      this.type= type
      this.key = key
      this.pendingProps = pendingProps
      this.tag = tag
      this.mode= mode
    }
  }
}


export { rootFiberNode, deletions, Fiber }