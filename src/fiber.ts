import { Hook, TNode } from "./interface";


export const rootFiberNode: any = {
  current: null,
  rootFiberWorkInProgress: null,
}
export const deletions: Fiber[]= []


export class Fiber{
  // 指向该fiber在另一次更新时对应的fiber
  alternate: Fiber = null
  // 作为静态数据结构的属性
  tag: 'HostRoot' | 'HostComponent' | 'FunctionComponent' | 'ClassComponent'  // Fiber对应组件的类型 Function/Class/Host...
  key: string | number = null // key属性
  elementType: ReactElement.Type // 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  type: ReactElement.Type // 对于 FunctionComponent，指函数本身，对于ClassCompoent，指class，对于HostComponent，指DOM节点tagName
  stateNode: TNode // Fiber对应的真实DOM节点
  // 用于连接其他Fiber节点形成Fiber树
  return: Fiber = null
  child: Fiber = null
  sibling: Fiber = null
  index: number
  ref: any = null
  // 作为动态的工作单元的属性, 保存本次更新造成的状态改变相关信息
  pendingProps: ReactElement.Props = {}
  memoizedProps: any
  updateQueue: any
  memoizedState: Hook
  dependencies: any[][] = []
  mode: any
  // hooks
  hooks: ('useState' | 'useMemo' | 'useEffect')[] = []
  // 保存本次更新会造成的DOM操作
  effectTag: 'PLACEMENT' | 'UPDATE' | 'DELETION' = null
  nextEffect: any
  firstEffect: any
  lastEffect: any
  // 调度优先级相关
  lanes: any
  childLanes: any

  constructor(
    tag: 'HostRoot' | 'HostComponent' | 'FunctionComponent' | 'ClassComponent',
    element: ReactElement.Jsx,
    mode?: any
  ) {
    const { type, props } = element
    const { key, ...pendingProps } = props
    this.type= type
    this.key = key
    this.pendingProps = pendingProps
    this.tag = tag
    this.mode = mode
  }
}



// export type Fiber = {|
//   // These first fields are conceptually members of an Instance. This used to
//   // be split into a separate type and intersected with the other Fiber fields,
//   // but until Flow fixes its intersection bugs, we've merged them into a
//   // single type.

//   // An Instance is shared between all versions of a component. We can easily
//   // break this out into a separate object to avoid copying so much to the
//   // alternate versions of the tree. We put this on a single object for now to
//   // minimize the number of objects created during the initial render.

//   // Tag identifying the type of fiber.
//   tag: WorkTag,

//   // Unique identifier of this child.
//   key: null | string,

//   // The value of element.type which is used to preserve the identity during
//   // reconciliation of this child.
//   elementType: any,

//   // The resolved function/class/ associated with this fiber.
//   type: any,

//   // The local state associated with this fiber.
//   stateNode: any,

//   // Conceptual aliases
//   // parent : Instance -> return The parent happens to be the same as the
//   // return fiber since we've merged the fiber and instance.

//   // Remaining fields belong to Fiber

//   // The Fiber to return to after finishing processing this one.
//   // This is effectively the parent, but there can be multiple parents (two)
//   // so this is only the parent of the thing we're currently processing.
//   // It is conceptually the same as the return address of a stack frame.
//   return: Fiber | null,

//   // Singly Linked List Tree Structure.
//   child: Fiber | null,
//   sibling: Fiber | null,
//   index: number,

//   // The ref last used to attach this node.
//   // I'll avoid adding an owner field for prod and model that as functions.
//   ref:
//     | null
//     | (((handle: mixed) => void) & {_stringRef: ?string, ...})
//     | RefObject,

//   // Input is the data coming into process this fiber. Arguments. Props.
//   pendingProps: any, // This type will be more specific once we overload the tag.
//   memoizedProps: any, // The props used to create the output.

//   // A queue of state updates and callbacks.
//   updateQueue: mixed,

//   // The state used to create the output
//   memoizedState: any,

//   // Dependencies (contexts, events) for this fiber, if it has any
//   dependencies: Dependencies | null,

//   // Bitfield that describes properties about the fiber and its subtree. E.g.
//   // the ConcurrentMode flag indicates whether the subtree should be async-by-
//   // default. When a fiber is created, it inherits the mode of its
//   // parent. Additional flags can be set at creation time, but after that the
//   // value should remain unchanged throughout the fiber's lifetime, particularly
//   // before its child fibers are created.
//   mode: TypeOfMode,

//   // Effect
//   flags: Flags,
//   subtreeFlags: Flags,
//   deletions: Array<Fiber> | null,

//   // Singly linked list fast path to the next fiber with side-effects.
//   nextEffect: Fiber | null,

//   // The first and last fiber with side-effect within this subtree. This allows
//   // us to reuse a slice of the linked list when we reuse the work done within
//   // this fiber.
//   firstEffect: Fiber | null,
//   lastEffect: Fiber | null,

//   lanes: Lanes,
//   childLanes: Lanes,

//   // This is a pooled version of a Fiber. Every fiber that gets updated will
//   // eventually have a pair. There are cases when we can clean up pairs to save
//   // memory if we need to.
//   alternate: Fiber | null,

//   // Time spent rendering this Fiber and its descendants for the current update.
//   // This tells us how well the tree makes use of sCU for memoization.
//   // It is reset to 0 each time we render and only updated when we don't bailout.
//   // This field is only set when the enableProfilerTimer flag is enabled.
//   actualDuration?: number,

//   // If the Fiber is currently active in the "render" phase,
//   // This marks the time at which the work began.
//   // This field is only set when the enableProfilerTimer flag is enabled.
//   actualStartTime?: number,

//   // Duration of the most recent render time for this Fiber.
//   // This value is not updated when we bailout for memoization purposes.
//   // This field is only set when the enableProfilerTimer flag is enabled.
//   selfBaseDuration?: number,

//   // Sum of base times for all descendants of this Fiber.
//   // This value bubbles up during the "complete" phase.
//   // This field is only set when the enableProfilerTimer flag is enabled.
//   treeBaseDuration?: number,

//   // Conceptual aliases
//   // workInProgress : Fiber ->  alternate The alternate used for reuse happens
//   // to be the same as work in progress.
//   // __DEV__ only

//   _debugSource?: Source | null,
//   _debugOwner?: Fiber | null,
//   _debugIsCurrentlyTiming?: boolean,
//   _debugNeedsRemount?: boolean,

//   // Used to verify that the order of hooks does not change between renders.
//   _debugHookTypes?: Array<HookType> | null,
// |};