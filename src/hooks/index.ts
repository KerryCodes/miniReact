import { Fiber, rootFiberNode } from "../fiber"
import { Hook, Update, UpdateQueue } from "../interface"
import { currentlyRenderingFiber } from "../reconciler"
import { performWorkOnRoot } from "../renderer"
import { updateReducer } from "./useReducer"
import { mountState, updateState } from "./useState"


let firstWorkInProgressHook: Hook
let workInProgressHook: Hook


// function getHookState(index: number, type: 'useState' | 'useMemo' | 'useEffect') {
//   currentlyRenderingFiber
// }


export function recoverIndex() {
  firstWorkInProgressHook = null
  workInProgressHook = null
}


// function useState<T>(initialState: T) {
//   currentIndex++
//   if (rootFiberNode.current === null) {
//     currentlyRenderingFiber.hooks.push('useState')
//     currentlyRenderingFiber.memoizedState.push(initialState)
//     currentlyRenderingFiber.dependencies.push([])
//   }
//   const setState = (index: number, currentlyRenderingFiber:any, newState: T) => {
//     currentlyRenderingFiber.memoizedState[index] = newState
//     rootFiberNode.rootFiberWorkInProgress = {
//       ...rootFiberNode.current,
//       alternate: rootFiberNode.current,
//     }
//     rootFiberNode.current.alternate= rootFiberNode.rootFiberWorkInProgress
//     performWorkOnRoot()
//   }
//   //@ts-ignore
//   return [currentlyRenderingFiber.memoizedState[currentIndex], setState.bind(this, currentIndex, currentlyRenderingFiber)]
// }



// Mount 阶段Hooks的定义
export const HooksDispatcherOnMount = {
  useState: mountState,
  // useReducer: mountReducer,
  // useEffect: mountEffect,
}


// Update阶段Hooks的定义
export const HooksDispatcherOnUpdate = {
  useReducer: updateReducer,
  useState: updateState,
  // useEffect: updateEffect,
}


export function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null,
  }
  if (workInProgressHook === null) {
    // 当前workInProgressHook链表为空的话，
    // 将当前Hook作为第一个Hook
    firstWorkInProgressHook = workInProgressHook = hook
    currentlyRenderingFiber.memoizedState = firstWorkInProgressHook
  } else {
    // 否则将当前Hook添加到Hook链表的末尾
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}


export const updateWorkInProgressHook = mountWorkInProgressHook


export function dispatchAction(fiber: Fiber, queue: UpdateQueue, action: (pre: any) => any | any) {
  const update : Update = {
    action,
    next: null,
  };
  // 将update对象添加到循环链表中
  if (queue.last === null) {
    // 链表为空，将当前更新作为第一个，并保持循环
    update.next = update;
  } else {
    const first = queue.last.next
    if (first !== null) {
      // 在最新的update对象后面插入新的update对象
      update.next = first;
    }
    queue.last.next = update;
  }
  // 将表头保持在最新的update对象上
  queue.last = update
  // 进行调度工作
  performWorkOnRoot()
}